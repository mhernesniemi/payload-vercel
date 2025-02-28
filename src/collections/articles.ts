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
        return `/${locale}/articles/${doc.slug}?preview=${process.env.PREVIEW_SECRET}`;
      }
      return null;
    },
  },
  fields: [
    {
      name: "testComponentField",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/TestComponent",
        },
      },
    },
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
    {
      name: "collection",
      type: "text",
      defaultValue: "articles",
      admin: {
        readOnly: true,
        hidden: true,
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
