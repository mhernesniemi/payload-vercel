import { Field } from "payload";
import { HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { BlocksFeature } from "@payloadcms/richtext-lexical";
import {
  mediaBlock,
  largeFeaturedPostBlock,
  smallFeaturedPostsWrapperBlock,
  ctaBlock,
  linkListBlock,
  contactsBlock,
  videoEmbedBlock,
  quoteBlock,
} from "@/blocks";

export const defaultContentFields: Field[] = [
  {
    name: "title",
    type: "text",
    required: true,
    localized: true,
  },
  {
    name: "heroText",
    type: "textarea",
    localized: true,
  },
  {
    name: "heroImage",
    type: "upload",
    relationTo: "media",
    localized: true,
  },
  {
    name: "content",
    type: "richText",
    localized: true,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => {
        return [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
          BlocksFeature({
            blocks: [
              mediaBlock,
              largeFeaturedPostBlock,
              smallFeaturedPostsWrapperBlock,
              ctaBlock,
              linkListBlock,
              contactsBlock,
              videoEmbedBlock,
              quoteBlock,
            ],
          }),
        ];
      },
    }),
  },
  {
    name: "slug",
    type: "text",
    required: true,
    unique: true,
    admin: {
      position: "sidebar",
      description: "The slug is automatically generated from the title",
    },
    hooks: {
      beforeValidate: [
        ({ data, value }: { data?: { title?: string }; value?: string }) => {
          if (!value && data?.title) {
            return data.title
              .toLowerCase()
              .replace(/ä/g, "a")
              .replace(/ö/g, "o")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
          }
          return value;
        },
      ],
    },
  },
  {
    name: "createdBy",
    type: "relationship",
    relationTo: "users",
    admin: {
      position: "sidebar",
      readOnly: true,
    },
    hooks: {
      beforeChange: [
        ({ req, operation }) => {
          if (operation === "create" && req.user) {
            return req.user.id;
          }
          return null;
        },
      ],
    },
  },
];
