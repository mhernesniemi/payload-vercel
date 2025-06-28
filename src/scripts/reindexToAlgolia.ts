import {
  getAlgoliaClient,
  getAlgoliaIndexName,
  IndexableDocument,
  indexDocumentToAlgolia,
} from "@/lib/algolia-utils";
import { getPayload } from "payload";
import config from "../payload.config";

const reindexToAlgolia = async () => {
  const payload = await getPayload({ config });

  console.log("Starting Algolia reindex...");

  const collections = ["articles", "news", "collection-page"];
  const locales = ["fi", "en"];

  try {
    const client = getAlgoliaClient();

    for (const locale of locales) {
      const indexName = getAlgoliaIndexName(locale as "fi" | "en");
      console.log(`Processing index: ${indexName}`);

      // Clear existing index
      try {
        await client.clearObjects({ indexName });
        console.log(`Cleared existing data from ${indexName}`);
      } catch (_error) {
        console.log(`Index ${indexName} doesn't exist yet, creating new one`);
      }

      // Reindex all collections for this locale
      for (const collectionSlug of collections) {
        console.log(`Reindexing ${collectionSlug} in ${locale}...`);

        try {
          const docs = await payload.find({
            collection: collectionSlug as "articles" | "news" | "collection-page",
            locale: locale as "fi" | "en",
            limit: 1000,
            where: {
              _status: {
                equals: "published",
              },
            },
          });

          console.log(`Found ${docs.docs.length} documents in ${collectionSlug} (${locale})`);

          // Fetch category labels for each document
          for (const doc of docs.docs) {
            const categoryLabels = doc.categories
              ? await fetchCategoryLabels(doc.categories, payload)
              : [];

            const indexableDoc: IndexableDocument = {
              objectID: doc.id,
              title: doc.title || "",
              content: doc.content,
              slug: doc.slug || "",
              publishedDate: doc.publishedDate,
              createdAt: doc.createdAt,
              categories: categoryLabels,
              collection: collectionSlug,
              locale: locale,
            };

            const success = await indexDocumentToAlgolia(
              indexableDoc,
              payload,
              locale as "fi" | "en",
            );

            if (success) {
              console.log(`✓ Document ${doc.id} indexed`);
            } else {
              console.error(`✗ Failed to index document ${doc.id}`);
            }
          }
        } catch (error) {
          console.error(`Error processing collection ${collectionSlug} in ${locale}:`, error);
        }
      }

      console.log(`Completed reindexing for locale: ${locale}`);
    }

    console.log("✅ Algolia reindex completed successfully!");
  } catch (error) {
    console.error("❌ Error during Algolia reindex:", error);
    process.exit(1);
  }
};

// Helper function to fetch category labels
const fetchCategoryLabels = async (
  categories: string[] | { id: string }[],
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<string[]> => {
  if (!categories || categories.length === 0) return [];

  try {
    // If categories are already strings, return them
    if (typeof categories[0] === "string") {
      return categories as string[];
    }

    // If categories are objects with IDs, fetch the actual category data
    const categoryIds = categories.map((cat: unknown) =>
      typeof cat === "string" ? cat : (cat as { id: string }).id,
    );

    const categoryData = await payload.find({
      collection: "categories",
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    return categoryData.docs
      .map((cat: unknown) => {
        const category = cat as { title?: string; name?: string };
        return category.title || category.name || "";
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching category labels:", error);
    return [];
  }
};

reindexToAlgolia();
