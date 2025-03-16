import { ELASTIC_INDEX_NAME } from "@/lib/constants";
import { createIndexWithMappings, elasticClient, richTextToPlainText } from "@/lib/elastic-utils";
import config from "@payload-config";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook, getPayload } from "payload";
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
        doc.categories && Array.isArray(doc.categories)
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

      await elasticClient.index({
        index: ELASTIC_INDEX_NAME,
        id: doc.id,
        body: {
          id: doc.id,
          title: doc.title,
          content: doc.content ? richTextToPlainText(doc.content) : null,
          slug: doc.slug,
          publishedDate: doc.publishedDate,
          categories: validCategoryLabels,
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
