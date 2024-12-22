import {
  largeFeaturePostBlock,
  smallFeaturePostsWrapperBlock,
  ctaBlock,
  mediaBlock,
  videoEmbedBlock,
  linkListBlock,
  contactPeopleBlock,
  quoteBlock,
} from "@/blocks";
import { GlobalConfig } from "payload";

export const FrontPage: GlobalConfig = {
  slug: "front-page",
  access: {
    read: () => true,
  },
  admin: {
    group: "Pages",
  },
  fields: [
    {
      name: "content",
      type: "blocks",
      required: true,
      blocks: [
        ctaBlock,
        largeFeaturePostBlock,
        smallFeaturePostsWrapperBlock,
        linkListBlock,
        contactPeopleBlock,
        videoEmbedBlock,
        mediaBlock,
        quoteBlock,
      ],
    },
  ],
};
