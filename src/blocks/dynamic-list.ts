import { Block, FieldHook } from "payload";
import { getPayload } from "payload";

type CollectionType = "articles" | "news" | "collection-pages" | "contacts";

export const dynamicListBlock: Block = {
  slug: "dynamicList",
  labels: {
    singular: "Dynamic List",
    plural: "Dynamic Lists",
  },
  fields: [
    {
      name: "collections",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "Articles", value: "articles" },
        { label: "News", value: "news" },
        { label: "Collection Pages", value: "collection-pages" },
        { label: "Contacts", value: "contacts" },
      ],
    },
    {
      name: "sortBy",
      type: "select",
      required: true,
      defaultValue: "createdAt",
      options: [
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
        { label: "Published Date", value: "publishedDate" },
      ],
    },
    {
      name: "sortOrder",
      type: "select",
      required: true,
      defaultValue: "desc",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
    {
      name: "limit",
      type: "number",
      required: true,
      defaultValue: 10,
      min: 1,
      max: 100,
    },
    {
      name: "fetchedItems",
      type: "array",
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          (async ({ siblingData, value }) => {
            console.log("siblingData.collections", siblingData?.collections);
            console.log("siblingData.sortBy", siblingData?.sortBy);
            console.log("siblingData.sortOrder", siblingData?.sortOrder);
            console.log("siblingData.limit", siblingData?.limit);

            if (
              !siblingData?.collections ||
              !siblingData?.sortBy ||
              !siblingData?.sortOrder ||
              !siblingData?.limit
            ) {
              return value || [];
            }

            const config = await import("@/payload.config").then((m) => m.default);
            const payload = await getPayload({
              config,
            });

            const results = await Promise.all(
              (siblingData.collections as CollectionType[]).map(async (collection) => {
                const response = await payload.find({
                  collection: collection,
                  sort: `${siblingData.sortBy}${siblingData.sortOrder === "desc" ? "-desc" : ""}`,
                  limit: siblingData.limit,
                });

                return response.docs.map((doc) => ({
                  reference: {
                    relationTo: collection,
                    value: doc.id,
                  },
                }));
              }),
            );
            console.log("results", results);
            console.log("results.flat()", results.flat());
            return results.flat();
          }) as FieldHook,
        ],
      },
      fields: [
        {
          name: "reference",
          type: "relationship",
          relationTo: ["articles", "news", "collection-pages", "contacts"],
          required: true,
        },
      ],
    },
  ],
  interfaceName: "DynamicListBlock",
};
