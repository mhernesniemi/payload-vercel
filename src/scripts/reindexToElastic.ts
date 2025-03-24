import {
  createIndexWithMappings,
  elasticClient,
  fetchCategoryLabels,
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
          payload.logger.info(`Deleting existing index ${indexName}...`);
          await elasticClient.indices.delete({ index: indexName });
          payload.logger.info(`Successfully deleted index ${indexName}`);
        } else {
          payload.logger.info(`Index ${indexName} does not exist, no need to delete.`);
        }
      } catch (_error) {
        payload.logger.info(
          `Warning: Failed to delete index ${indexName}, it may not exist. Continuing with creation.`,
        );
      }

      // Create new language-specific index with mappings
      await createIndexWithMappings(indexName);
      payload.logger.info(`Created new index ${indexName}`);

      // Get all collections that should be indexed
      const collections = ["articles", "collection-pages", "news"] as const;

      for (const collectionSlug of collections) {
        payload.logger.info(`Processing collection: ${collectionSlug} for locale: ${locale}`);

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

        payload.logger.info(
          `Found ${docs.docs.length} documents in ${collectionSlug} for locale ${locale}`,
        );

        for (const doc of docs.docs as IndexableDocument[]) {
          // Fetch category labels
          const validCategoryLabels =
            "categories" in doc && doc.categories
              ? await fetchCategoryLabels(doc.categories, payload)
              : [];

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
              createdAt: doc.createdAt,
              categories: validCategoryLabels,
              collection: collectionSlug,
              locale: locale,
            },
            refresh: true,
          });

          payload.logger.info(
            `Indexed document ${doc.id} from ${collectionSlug} in index ${indexName}`,
          );
        }
      }
    }

    payload.logger.info("Reindexing completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during reindexing:", error);
    process.exit(1);
  }
};

reindexToElastic();
