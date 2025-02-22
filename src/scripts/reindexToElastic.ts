import { getPayload } from "payload";
import { elasticClient } from "@/lib/elastic-client";
import config from "@payload-config";
import { Article, CollectionPage, News, Reference } from "../payload-types";

type IndexableDocument = Article | CollectionPage | News | Reference;

interface RichTextChild {
  text?: string;
  [key: string]: unknown;
}

interface RichTextBlock {
  children?: RichTextChild[];
  [key: string]: unknown;
}

interface RichTextContent {
  root: {
    children: RichTextBlock[];
  };
}

const INDEX_NAME = "global";

// Funktio rich text -sisällön muuntamiseksi tekstiksi
const richTextToPlainText = (content: RichTextContent): string => {
  if (!content || !content.root || !content.root.children) {
    return "";
  }

  return content.root.children
    .map((block: RichTextBlock) => {
      if (block.children) {
        return block.children.map((child: RichTextChild) => child.text || "").join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
};

const reindexToElastic = async () => {
  try {
    const payload = await getPayload({ config });

    // Delete existing index if it exists
    const indexExists = await elasticClient.indices.exists({ index: INDEX_NAME });
    if (indexExists) {
      console.log(`Deleting existing index ${INDEX_NAME}...`);
      await elasticClient.indices.delete({ index: INDEX_NAME });
    }

    // Create new index with mappings
    await elasticClient.indices.create({
      index: INDEX_NAME,
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
    console.log(`Created new index ${INDEX_NAME}`);

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
          index: INDEX_NAME,
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
