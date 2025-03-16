import { ELASTIC_INDEX_NAME } from "@/lib/constants";
import { createIndexWithMappings, elasticClient, richTextToPlainText } from "@/lib/elastic-utils";
import config from "@/payload.config";
import { getPayload } from "payload";
import { Article, CollectionPage, News } from "../payload-types";

type IndexableDocument = Article | CollectionPage | News;

const reindexToElastic = async () => {
  try {
    const payload = await getPayload({ config });

    // Delete existing index if it exists
    try {
      const indexExists = await elasticClient.indices.exists({ index: ELASTIC_INDEX_NAME });
      if (indexExists) {
        console.log(`Deleting existing index ${ELASTIC_INDEX_NAME}...`);
        await elasticClient.indices.delete({ index: ELASTIC_INDEX_NAME });
        console.log(`Successfully deleted index ${ELASTIC_INDEX_NAME}`);
      } else {
        console.log(`Index ${ELASTIC_INDEX_NAME} does not exist, no need to delete.`);
      }
    } catch (_error) {
      console.log(
        `Warning: Failed to delete index ${ELASTIC_INDEX_NAME}, it may not exist. Continuing with creation.`,
      );
    }

    // Create new index with mappings
    await createIndexWithMappings();
    console.log(`Created new index ${ELASTIC_INDEX_NAME}`);

    // Get all collections that should be indexed
    const collections = ["articles", "collection-pages", "news"] as const;

    for (const collectionSlug of collections) {
      console.log(`Processing collection: ${collectionSlug}`);

      const docs = await payload.find({
        collection: collectionSlug,
        limit: 100, // Adjust based on your needs
      });

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

        // Index document
        await elasticClient.index({
          index: ELASTIC_INDEX_NAME,
          id: doc.id.toString(),
          body: {
            id: doc.id,
            title: doc.title,
            content: doc.content ? richTextToPlainText(doc.content) : null,
            slug: doc.slug,
            publishedDate: "publishedDate" in doc ? doc.publishedDate : null,
            categories: validCategoryLabels,
            collection: collectionSlug,
          },
          refresh: true,
        });
        console.log(`Indexed document ${doc.id} from ${collectionSlug}`);
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
