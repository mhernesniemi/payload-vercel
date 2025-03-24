import { Client } from "@elastic/elasticsearch/index";
import { Payload } from "payload";
import { ELASTIC_INDEX_NAME } from "./constants";

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

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  },
});

export const createIndexWithMappings = async (indexName: string = ELASTIC_INDEX_NAME) => {
  try {
    const exists = await elasticClient.indices.exists({ index: indexName });
    if (!exists) {
      await elasticClient.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {
              title: {
                type: "text",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              content: { type: "text" },
              slug: { type: "keyword" },
              publishedDate: { type: "date" },
              createdAt: { type: "date" },
              categories: {
                type: "keyword",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              collection: { type: "keyword" },
              locale: { type: "keyword" },
            },
          },
        },
      });

      // Create alias indices for sorting
      await elasticClient.indices.putAlias({
        index: indexName,
        name: `${indexName}_title_asc`,
        body: {
          routing: "title",
          is_write_index: false,
        },
      });

      await elasticClient.indices.putAlias({
        index: indexName,
        name: `${indexName}_title_desc`,
        body: {
          routing: "title",
          is_write_index: false,
        },
      });

      console.log(`Index ${indexName} created with sorting aliases`);
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
    return false;
  }
};

export const richTextToPlainText = (content: RichTextContent): string => {
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

export const getLanguageIndexName = (locale: string): string => {
  const lang = locale === "fi" ? "fi" : "en";
  return `${ELASTIC_INDEX_NAME}_${lang}`;
};

export const fetchCategoryLabels = async (
  categories: Array<number | { id: number }>,
  payload: Payload,
): Promise<string[]> => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  const categoryLabels = await Promise.all(
    categories.map(async (categoryId: number | { id: number }) => {
      // Ensure categoryId is a number or can be converted to number
      const id =
        typeof categoryId === "object" && categoryId !== null ? categoryId.id : Number(categoryId);

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
    }),
  );

  // Filter out null values from categoryLabels
  return categoryLabels.filter((label) => label !== null);
};
