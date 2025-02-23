import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { elasticClient } from "@/lib/elastic-utils";
import { getPayload } from "payload";
import config from "@payload-config";
import { createIndexWithMappings, richTextToPlainText } from "@/lib/elastic-utils";
import { ELASTIC_INDEX_NAME } from "@/lib/constants";
export const afterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  collection,
}) => {
  try {
    if (operation === "create" || operation === "update") {
      const indexCreated = await createIndexWithMappings();
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
        index: ELASTIC_INDEX_NAME,
        id: doc.id,
        body: {
          id: doc.id,
          title: doc.title,
          content: doc.content ? richTextToPlainText(doc.content) : null,
          slug: doc.slug,
          publishedDate: doc.publishedDate,
          categories: categoryLabels,
          collection: collection.slug,
        },
        refresh: true,
      });
      console.log(`Document ${doc.id} indexed in ${ELASTIC_INDEX_NAME}`);
    }
  } catch (error) {
    console.error(`Error in afterChangeHook for ${doc.id}:`, error);
  }
  return doc;
};

export const afterDeleteHook: CollectionAfterDeleteHook = async ({ doc, collection }) => {
  try {
    const exists = await elasticClient.indices.exists({ index: collection.slug });
    if (exists) {
      await elasticClient.delete({
        index: ELASTIC_INDEX_NAME,
        id: doc.id,
        refresh: true,
      });
      console.log(`Document ${doc.id} deleted from ${ELASTIC_INDEX_NAME}`);
    }
  } catch (error) {
    console.error(`Error in afterDeleteHook for ${doc.id}:`, error);
  }
  return doc;
};
