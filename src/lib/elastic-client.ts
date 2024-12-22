import { Client } from "@elastic/elasticsearch/index";

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  auth: {
    apiKey: {
      id: process.env.ELASTICSEARCH_API_KEY_ID!,
      api_key: process.env.ELASTICSEARCH_API_KEY!,
    },
  },
});
