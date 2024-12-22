import { Field } from "payload";
import { HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { BlocksFeature } from "@payloadcms/richtext-lexical";
import {
  mediaBlock,
  largeFeaturePostBlock,
  smallFeaturePostsWrapperBlock,
  ctaBlock,
  linkListBlock,
  contactPeopleBlock,
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
    required: true,
    localized: true,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => {
        return [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
          BlocksFeature({
            blocks: [
              mediaBlock,
              largeFeaturePostBlock,
              smallFeaturePostsWrapperBlock,
              ctaBlock,
              linkListBlock,
              contactPeopleBlock,
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
    },
  },
];
