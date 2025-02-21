import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME!,
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  },
  search_settings: {
    search_attributes: [
      { field: "title", weight: 3 },
      { field: "slug", weight: 2 },
    ],
    result_attributes: ["title", "slug"],
    highlight_attributes: ["title"],
  },
};

const apiClient = Client(apiConfig);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const results = await apiClient.handleRequest(data);
  return NextResponse.json(results);
}
