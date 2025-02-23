import { Field } from "payload";

export const linkField: Field[] = [
  {
    name: "label",
    type: "text",
  },
  {
    name: "isExternal",
    type: "checkbox",
    label: "External link",
  },
  {
    name: "internalUrl",
    type: "relationship",
    relationTo: ["articles", "collection-pages", "news"],
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
