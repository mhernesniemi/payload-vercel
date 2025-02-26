import { Block } from "payload";

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
  ],
  interfaceName: "DynamicListBlock",
};
