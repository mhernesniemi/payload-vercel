import {
  contactsBlock,
  ctaBlock,
  heroBlock,
  largeFeaturedPostBlock,
  linkListBlock,
  mediaBlock,
  quoteBlock,
  smallFeaturedPostsWrapperBlock,
  videoEmbedBlock,
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
      localized: true,
    },
    {
      name: "content",
      type: "blocks",
      required: true,
      localized: true,
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
