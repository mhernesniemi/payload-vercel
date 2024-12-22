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
      relationTo: "users",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedDate",
      type: "date",
      required: true,
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
