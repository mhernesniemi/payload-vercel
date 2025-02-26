import { Block } from "payload";
import { getPayload } from "payload";

type CollectionType = "articles" | "news" | "collection-pages";

export const dynamicListBlock: Block = {
  slug: "dynamicList",
  interfaceName: "DynamicListBlock",
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
      name: "items",
      type: "array",
      admin: {
        readOnly: true,
        hidden: true,
      },
      hooks: {
        afterRead: [
          async ({ siblingData }) => {
            if (
              !siblingData?.collections ||
              !siblingData?.sortBy ||
              !siblingData?.sortOrder ||
              !siblingData?.limit
            ) {
              return [];
            }

            const config = await import("@/payload.config").then((m) => m.default);
            const payload = await getPayload({
              config,
            });

            // Get all the results from the collections
            const results = await Promise.all(
              (siblingData.collections as CollectionType[]).map(async (collection) => {
                const response = await payload.find({
                  collection: collection,
                  sort: `${siblingData.sortBy}${siblingData.sortOrder === "desc" ? "-desc" : ""}`,
                  limit: siblingData.limit,
                  depth: 0,
                });

                return response.docs.map((doc) => ({
                  reference: {
                    relationTo: collection,
                    value: doc.id,
                  },
                  sortValue: doc[siblingData.sortBy as keyof typeof doc],
                }));
              }),
            );

            const flattenedResults = results.flat();

            // Sort combined results
            const sortedResults = flattenedResults.sort((a, b) => {
              if (siblingData.sortOrder === "desc") {
                return (
                  new Date(b.sortValue as string).getTime() -
                  new Date(a.sortValue as string).getTime()
                );
              }
              return (
                new Date(a.sortValue as string).getTime() -
                new Date(b.sortValue as string).getTime()
              );
            });

            // Apply final limit
            const limitedResults = sortedResults.slice(0, siblingData.limit);

            // Return only the reference objects
            return limitedResults.map((item) => ({
              reference: item.reference,
            }));
          },
        ],
      },
      fields: [
        {
          name: "reference",
          type: "relationship",
          relationTo: ["articles", "news", "collection-pages"],
          required: true,
        },
      ],
    },
  ],
};
