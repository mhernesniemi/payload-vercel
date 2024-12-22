import { CollectionConfig } from "payload";

export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    group: "Misc",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "title",
      type: "text",
      localized: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
      },
    },
  ],
};
