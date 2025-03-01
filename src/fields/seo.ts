import { seoPlugin } from "@payloadcms/plugin-seo";
import { Field } from "payload";

// SEO plugin config
export const seoConfig = seoPlugin({
  collections: ["articles", "news", "collection-page"],
  uploadsCollection: "media",
  generateTitle: ({ doc }) => {
    return doc?.title ? `${doc.title}` : "";
  },
  generateDescription: ({ doc }) => {
    if (doc?.excerpt) return doc.excerpt;
    return "";
  },
  generateURL: ({ doc, collectionSlug }) => {
    if (doc?.slug) {
      if (collectionSlug === "articles") {
        return `/articles/${doc.slug}`;
      }
      if (collectionSlug === "news") {
        return `/news/${doc.slug}`;
      }
      return `/${collectionSlug}/${doc.slug}`;
    }
    return "";
  },
});

// Collapsible SEO field group
export const seoField: Field = {
  label: "SEO",
  type: "collapsible",
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: "meta",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title (recommended max 60 characters)",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "SEO description (recommended max 160 characters)",
          },
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "SEO image",
          },
        },
      ],
    },
  ],
};
