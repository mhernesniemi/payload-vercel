import {
  createIndexWithMappings,
  elasticClient,
  getLanguageIndexName,
  richTextToPlainText,
} from "@/lib/elastic-utils";
import config from "@/payload.config";
import { getPayload } from "payload";
import { Article, CollectionPage, News } from "../payload-types";

type IndexableDocument = Article | CollectionPage | News;

type PayloadLocale = "en" | "fi" | "all";

const reindexToElastic = async () => {
  try {
    const payload = await getPayload({ config });
    const languages = ["en", "fi"] as PayloadLocale[];

    // Process each language separately
    for (const locale of languages) {
      const indexName = getLanguageIndexName(locale);

      // Delete existing language-specific index if it exists
      try {
        const indexExists = await elasticClient.indices.exists({ index: indexName });
        if (indexExists) {
          console.log(`Deleting existing index ${indexName}...`);
          await elasticClient.indices.delete({ index: indexName });
          console.log(`Successfully deleted index ${indexName}`);
        } else {
          console.log(`Index ${indexName} does not exist, no need to delete.`);
        }
      } catch (_error) {
        console.log(
          `Warning: Failed to delete index ${indexName}, it may not exist. Continuing with creation.`,
        );
      }

      // Create new language-specific index with mappings
      await createIndexWithMappings(indexName);
      console.log(`Created new index ${indexName}`);

      // Get all collections that should be indexed
      const collections = ["articles", "collection-pages", "news"] as const;

      for (const collectionSlug of collections) {
        console.log(`Processing collection: ${collectionSlug} for locale: ${locale}`);

        const docs = await payload.find({
          collection: collectionSlug,
          limit: 1000, // Adjust based on your needs
          locale: locale,
          fallbackLocale: false,
          draft: false,
          where: {
            title: {
              exists: true,
              not_equals: "",
            },
          },
        });

        console.log(
          `Found ${docs.docs.length} documents in ${collectionSlug} for locale ${locale}`,
        );

        for (const doc of docs.docs as IndexableDocument[]) {
          // Fetch category labels if the document has categories
          const categoryLabels = await Promise.all(
            "categories" in doc && doc.categories && Array.isArray(doc.categories)
              ? doc.categories.map(async (categoryId: number | { id: number }) => {
                  // Ensure categoryId is a number or can be converted to number
                  const id =
                    typeof categoryId === "object" && categoryId !== null
                      ? categoryId.id
                      : Number(categoryId);

                  try {
                    const category = await payload.findByID({
                      collection: "categories",
                      id,
                    });
                    return category?.label || null;
                  } catch (error) {
                    console.error(`Error fetching category ${id}:`, error);
                    return null;
                  }
                })
              : [],
          );

          // Filter out null values from categoryLabels
          const validCategoryLabels = categoryLabels.filter((label) => label !== null);

          // Index document to language-specific index
          await elasticClient.index({
            index: indexName,
            id: doc.id.toString(),
            body: {
              id: doc.id,
              title: doc.title,
              content: doc.content ? richTextToPlainText(doc.content) : null,
              slug: doc.slug,
              publishedDate: "publishedDate" in doc ? doc.publishedDate : null,
              categories: validCategoryLabels,
              collection: collectionSlug,
              locale: locale,
            },
            refresh: true,
          });

          console.log(`Indexed document ${doc.id} from ${collectionSlug} in index ${indexName}`);
        }
      }
    }

    console.log("Reindexing completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during reindexing:", error);
    process.exit(1);
  }
};

reindexToElastic();
