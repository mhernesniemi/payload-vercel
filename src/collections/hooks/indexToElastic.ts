import {
  createIndexWithMappings,
  elasticClient,
  getLanguageIndexName,
  richTextToPlainText,
} from "@/lib/elastic-utils";
import config from "@payload-config";
import { CollectionAfterChangeHook, CollectionAfterDeleteHook, getPayload } from "payload";

export const indexToElasticHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  collection,
}) => {
  try {
    if (operation === "create" || operation === "update") {
      // Determine document language (assuming there's a locale field in the document)
      const locale = doc.locale || "fi";
      const indexName = getLanguageIndexName(locale);

      // Create index for this language if it doesn't exist
      const indexCreated = await createIndexWithMappings(indexName);
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
        index: indexName,
        id: doc.id,
        body: {
          id: doc.id,
          title: doc.title,
          content: doc.content ? richTextToPlainText(doc.content) : null,
          slug: doc.slug,
          publishedDate: doc.publishedDate,
          categories: validCategoryLabels,
          collection: collection.slug,
          locale: locale,
        },
        refresh: true,
      });
      console.log(`Document ${doc.id} indexed in ${indexName}`);
    }
  } catch (error) {
    console.error(`Error in indexToElasticHook for ${doc.id}:`, error);
  }
  return doc;
};

export const removeFromElasticHook: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    const locale = doc.locale || "fi";
    const indexName = getLanguageIndexName(locale);

    const exists = await elasticClient.indices.exists({ index: indexName });
    if (exists) {
      await elasticClient.delete({
        index: indexName,
        id: doc.id,
        refresh: true,
      });
      console.log(`Document ${doc.id} deleted from ${indexName}`);
    }
  } catch (error) {
    console.error(`Error in removeFromElasticHook for ${doc.id}:`, error);
  }
  return doc;
};
