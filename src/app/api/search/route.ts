import Client from "@searchkit/api";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

// Reading the certificate from the file
const CA_CERT_PATH =
  process.env.ELASTICSEARCH_CA_CERT_PATH || "/etc/elasticsearch/certs/http_ca.crt";
let caCert;
try {
  caCert = fs.existsSync(CA_CERT_PATH) ? fs.readFileSync(CA_CERT_PATH) : undefined;
} catch (error) {
  console.error(`Error reading the certificate: ${error}`);
}

const apiConfig = {
  connection: {
    host: process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST || "http://localhost:9200",
    apiKey: process.env.ELASTICSEARCH_API_KEY!,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || "elastic",
      password: process.env.ELASTICSEARCH_PASSWORD!,
    },
    ssl: {
      ca: caCert, // Using the certificate from the file
      rejectUnauthorized: true, // Ensuring the connection security
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
  try {
    const data = await req.json();
    const results = await apiClient.handleRequest(data);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Elasticsearch search error:", error);
    return NextResponse.json({ error: "Search error" }, { status: 500 });
  }
}
