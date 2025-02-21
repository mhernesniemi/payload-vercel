import { CollectionConfig } from "payload";
import { defaultContentFields } from "@/fields/default-content-fields";
import { afterChangeHook, afterDeleteHook } from "./hooks/indexToElastic";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    group: "Pages",
    preview: (doc, { locale }) => {
      if (doc?.slug) {
        return `/${locale}/articles/${doc.slug}`;
      }
      return null;
    },
  },
  fields: [
    ...defaultContentFields,
    {
      name: "author",
      type: "relationship",
      relationTo: "contacts",
      admin: {
        position: "sidebar",
      },
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
      name: "publishedDate",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
};
