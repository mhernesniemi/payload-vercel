import {
  largeFeaturedPostBlock,
  smallFeaturedPostsWrapperBlock,
  ctaBlock,
  mediaBlock,
  videoEmbedBlock,
  linkListBlock,
  contactsBlock,
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
        largeFeaturedPostBlock,
        smallFeaturedPostsWrapperBlock,
        linkListBlock,
        contactsBlock,
        videoEmbedBlock,
        mediaBlock,
        quoteBlock,
      ],
    },
  ],
};
