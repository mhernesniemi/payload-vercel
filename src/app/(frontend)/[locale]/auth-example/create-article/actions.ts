"use server";

import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Article } from "@/payload-types";

export async function fetchUserArticles(userId: number) {
  const payload = await getPayload({
    config: configPromise,
  });

  const response = await payload.find({
    collection: "articles",
    where: {
      "createdBy.id": {
        equals: userId,
      },
    },
  });

  return response.docs as Article[];
}

export async function createArticle(title: string, userId: number) {
  const payload = await getPayload({
    config: configPromise,
  });

  await payload.create({
    collection: "articles",
    data: {
      title,
      slug: title.toLowerCase().replace(/ /g, "-"),
    },
    user: {
      id: userId,
    },
  });
}
