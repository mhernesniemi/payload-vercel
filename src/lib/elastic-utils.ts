import { Client } from "@elastic/elasticsearch/index";
import { ELASTIC_INDEX_NAME } from "./constants";

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
      return true;
    }
    return true;
  } catch (error) {
    console.error(`Error creating index ${indexName}:`, error);
    return false;
  }
};

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
