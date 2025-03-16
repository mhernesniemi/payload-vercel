import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
    apiKey: process.env.ELASTICSEARCH_API_KEY!,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
    ssl: {
      ca: process.env.ELASTICSEARCH_CA_CERT,
      rejectUnauthorized: false, // Unsafe for production
    },
  },
  search_settings: {
    search_attributes: [
      { field: "title", weight: 3 },
      { field: "slug", weight: 2 },
    ],
    result_attributes: ["title", "slug", "categories"],
    facet_attributes: [
      {
        attribute: "categories",
        field: "categories.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
      {
        attribute: "collection",
        field: "collection.keyword",
        type: "string" as "string" | "numeric" | "date",
      },
    ],
  },
};

const apiClient = Client(apiConfig);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const results = await apiClient.handleRequest(data);
  return NextResponse.json(results);
}
