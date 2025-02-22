import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { elasticClient } from "@/lib/elastic-client";
import { getPayload } from "payload";
import config from "@payload-config";

const createIndexIfNotExists = async (indexName: string) => {
  try {
    const exists = await elasticClient.indices.exists({ index: indexName });
    if (!exists) {
      await elasticClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: { type: "text" },
              content: { type: "text" },
              slug: { type: "keyword" },
              publishedDate: { type: "date" },
              categories: {
                type: "keyword",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              collection: { type: "keyword" },
            },
          },
        },
      });
      console.log(`Index ${indexName} created`);
    }
  } catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
    return false;
  }
  return true;
};

export const afterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  collection,
}) => {
  try {
    if (operation === "create" || operation === "update") {
      const INDEX_NAME = "global";
      const indexCreated = await createIndexIfNotExists(INDEX_NAME);
      if (!indexCreated) return doc;

      const payload = await getPayload({ config });

      // Fetch category labels
      const categoryLabels = await Promise.all(
        doc.categories?.map(async (categoryId: number) => {
          const category = await payload.findByID({
            collection: "categories",
            id: categoryId,
          });
          return category?.label;
        }) || [],
      );

      await elasticClient.index({
        index: INDEX_NAME,
        id: doc.id,
        body: {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          slug: doc.slug,
          publishedDate: doc.publishedDate,
          categories: categoryLabels,
          collection: collection.slug,
        },
        refresh: true,
      });
      console.log(`Document ${doc.id} indexed in ${INDEX_NAME}`);
    }
  } catch (error) {
    console.error(`Error in afterChangeHook for ${collection.slug}:`, error);
  }
  return doc;
};

export const afterDeleteHook: CollectionAfterDeleteHook = async ({ doc, collection }) => {
  try {
    const exists = await elasticClient.indices.exists({ index: collection.slug });
    if (exists) {
      await elasticClient.delete({
        index: collection.slug,
        id: doc.id,
        refresh: true,
      });
      console.log(`Document ${doc.id} deleted from ${collection.slug}`);
    }
  } catch (error) {
    console.error(`Error in afterDeleteHook for ${collection.slug}:`, error);
  }
  return doc;
};
