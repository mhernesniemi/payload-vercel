import Client from "@searchkit/api";
import { NextRequest, NextResponse } from "next/server";

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
    apiKey: process.env.ELASTICSEARCH_API_KEY!,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || "elastic",
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
  },
  search_settings: {
    search_attributes: [
      { field: "title", weight: 3 },
      { field: "slug", weight: 2 },
    ],
    result_attributes: ["title", "slug", "categories", "collection"],
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
    sorting: {
      default: {
        field: "_score",
        order: "desc" as const,
      },
      _title_asc: {
        field: "title.sort",
        order: "asc" as const,
      },
      _title_desc: {
        field: "title.sort",
        order: "desc" as const,
      },
      _date_asc: {
        field: "date",
        order: "asc" as const,
      },
      _date_desc: {
        field: "date",
        order: "desc" as const,
      },
    },
  },
};

const apiClient = Client(apiConfig);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const results = await apiClient.handleRequest(data);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Elasticsearch search error:", error);
    return NextResponse.json({ error: "Search error" }, { status: 500 });
  }
}
