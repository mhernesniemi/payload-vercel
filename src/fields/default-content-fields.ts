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
    name: "titleAIAssistant",
    type: "ui",
    admin: {
      components: {
        Field: {
          path: "@/components/admin-ui/AIAssistant",
          clientProps: {
            appliedTo: "title",
          },
        },
      },
    },
  },
  {
    name: "description",
    type: "textarea",
    localized: true,
  },
  {
    name: "descriptionAIAssistant",
    type: "ui",
    admin: {
      components: {
        Field: {
          path: "@/components/admin-ui/AIAssistant",
          clientProps: {
            appliedTo: "description",
          },
        },
      },
    },
  },
  {
    name: "image",
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
          HeadingFeature({
            enabledHeadingSizes: ["h2", "h3"],
          }),
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
      description: "The slug is automatically generated from the title if empty",
    },
    hooks: {
      beforeValidate: [
        ({
          data,
          value,
        }: {
          data?: {
            title?: string;
          };
          value?: string;
        }) => {
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
      hidden: true,
    },
    hooks: {
      beforeChange: [
        ({ req, operation, value }) => {
          if (!value && operation === "create" && req.user) {
            return req.user.id;
          }
          return value;
        },
      ],
    },
  },
  {
    name: "sticky",
    type: "checkbox",
    admin: {
      position: "sidebar",
      description: "If checked, the post is displayed at the top of lists",
    },
  },
];
