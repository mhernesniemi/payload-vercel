import { Field } from "payload";

export const linkField: Field[] = [
  {
    name: "isExternal",
    type: "checkbox",
    label: "External link",
  },
  {
    name: "internalUrl",
    type: "relationship",
    relationTo: ["articles", "collection-pages", "news", "references"],
    required: true,
    admin: {
      condition: (_, siblingData) => !siblingData.isExternal,
    },
  },
  {
    name: "externalUrl",
    type: "text",
    required: true,
    admin: {
      condition: (_, siblingData) => siblingData.isExternal,
    },
  },
];
