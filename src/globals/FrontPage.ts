import {
  largeFeaturedPostBlock,
  smallFeaturedPostsWrapperBlock,
  ctaBlock,
  mediaBlock,
  videoEmbedBlock,
  linkListBlock,
  contactsBlock,
  quoteBlock,
  heroBlock,
} from "@/blocks";
import { dynamicListBlock } from "@/blocks/dynamic-list";
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
      name: "hero",
      type: "blocks",
      required: true,
      maxRows: 1,
      blocks: [heroBlock],
    },
    {
      name: "content",
      type: "blocks",
      required: true,
      blocks: [
        ctaBlock,
        largeFeaturedPostBlock,
        smallFeaturedPostsWrapperBlock,
        linkListBlock,
        contactsBlock,
        videoEmbedBlock,
        mediaBlock,
        quoteBlock,
        dynamicListBlock,
      ],
    },
  ],
};
