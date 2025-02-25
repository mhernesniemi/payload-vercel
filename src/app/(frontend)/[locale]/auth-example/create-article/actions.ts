"use server";

import { getPayload } from "payload";
import { Article } from "@/payload-types";

async function getConfig() {
  const { default: configPromise } = await import("@/payload.config");
  return configPromise;
}

export async function fetchUserArticles(userId: number) {
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  const response = await payload.find({
    collection: "articles",
    where: {
      "createdBy.id": {
        equals: userId,
      },
      _status: {
        equals: "published",
      },
    },
  });

  return response.docs as Article[];
}

export async function createArticle(title: string, userId: number) {
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  await payload.create({
    collection: "articles",
    data: {
      title,
      slug: title.toLowerCase().replace(/ /g, "-"),
      _status: "published",
    },
    user: {
      id: userId,
    },
  });
}

export async function deleteArticle(articleId: string, userId: number) {
  const config = await getConfig();
  const payload = await getPayload({
    config,
  });

  await payload.delete({
    collection: "articles",
    id: articleId,
    user: {
      id: userId,
    },
  });
}
