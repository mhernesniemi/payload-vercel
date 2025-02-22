import { getPayload } from "payload";
import { elasticClient } from "@/lib/elastic-utils";
import config from "@payload-config";
import { Article, CollectionPage, News, Reference } from "../payload-types";
import { createIndexWithMappings, richTextToPlainText } from "@/lib/elastic-utils";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";

type IndexableDocument = Article | CollectionPage | News | Reference;

const reindexToElastic = async () => {
  try {
    const payload = await getPayload({ config });

    // Delete existing index if it exists
    const indexExists = await elasticClient.indices.exists({ index: ELASTIC_INDEX_NAME });
    if (indexExists) {
      console.log(`Deleting existing index ${ELASTIC_INDEX_NAME}...`);
      await elasticClient.indices.delete({ index: ELASTIC_INDEX_NAME });
    }

    // Create new index with mappings
    await createIndexWithMappings();
    console.log(`Created new index ${ELASTIC_INDEX_NAME}`);

    // Get all collections that should be indexed
    const collections = ["articles", "collection-pages", "news", "references"] as const;

    for (const collectionSlug of collections) {
      console.log(`Processing collection: ${collectionSlug}`);

      const docs = await payload.find({
        collection: collectionSlug,
        limit: 100, // Adjust based on your needs
      });

      for (const doc of docs.docs as IndexableDocument[]) {
        // Fetch category labels if the document has categories
        const categoryLabels = await Promise.all(
          "categories" in doc && doc.categories
            ? (doc.categories as number[]).map(async (categoryId) => {
                const category = await payload.findByID({
                  collection: "categories",
                  id: categoryId,
                });
                return category?.label;
              })
            : [],
        );

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
            categories: categoryLabels,
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
