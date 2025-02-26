"use server";

import { getPayload } from "payload";

async function getConfig() {
  const { default: configPromise } = await import("@/payload.config");
  return configPromise;
}

export async function fetchDynamicList(
  collections: ("articles" | "news" | "collection-pages" | "contacts")[],
  sortBy: "createdAt" | "updatedAt" | "publishedDate",
  sortOrder: "asc" | "desc",
  limit: number,
) {
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  const results = await Promise.all(
    collections.map(async (collection) => {
      const response = await payload.find({
        collection: collection,
        sort: `${sortBy}${sortOrder === "desc" ? "-desc" : ""}`,
        limit: limit,
      });
      return response.docs;
    }),
  );

  return results.flat();
}
