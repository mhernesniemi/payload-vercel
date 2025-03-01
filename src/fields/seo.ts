import { seoPlugin } from "@payloadcms/plugin-seo";
import { Field } from "payload";
import { generateSeoDescription, generateSeoTitle } from "./actions/seoActions";

let isGeneratingDescription = false;

export const seoConfig = seoPlugin({
  collections: ["articles", "news", "collection-page"],
  uploadsCollection: "media",
  generateTitle: async ({ doc }) => {
    if (doc?.title.length > 60 || doc?.title.length < 50) {
      const generatedTitle = await generateSeoTitle(doc?.title);
      return generatedTitle;
    }
    return doc?.title ? `${doc.title}` : "";
  },
  generateDescription: async ({ doc }) => {
    if (isGeneratingDescription) {
      return "Generating SEO description...";
    }

    try {
      isGeneratingDescription = true;

      const title = doc?.title || "";
      const description = doc?.description || "";
      const generatedDescription = await generateSeoDescription(title, description);
      return generatedDescription;
    } catch (error) {
      console.error("Error generating SEO description:", error);
      return "";
    } finally {
      // Make sure the loading state is reset
      isGeneratingDescription = false;
      console.log("SEO description generation completed");
    }
  },
  generateURL: ({ doc, collectionSlug }) => {
    if (doc?.slug) {
      if (collectionSlug === "articles") {
        return `${process.env.NEXT_PUBLIC_ROOT_URL}/articles/${doc.slug}`;
      }
      if (collectionSlug === "news") {
        return `${process.env.NEXT_PUBLIC_ROOT_URL}/news/${doc.slug}`;
      }
      return `${process.env.NEXT_PUBLIC_ROOT_URL}/${collectionSlug}/${doc.slug}`;
    }
    return "";
  },
  fields: ({ defaultFields }) => {
    return [
      {
        type: "collapsible",
        label: "SEO fields",
        admin: {
          initCollapsed: true,
        },
        fields: defaultFields,
      },
    ];
  },
});

export const seoField: Field = {
  label: "SEO",
  type: "collapsible",
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
