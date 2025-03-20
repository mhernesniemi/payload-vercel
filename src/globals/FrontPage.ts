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
import { revalidatePath } from "next/cache";
import { GlobalAfterChangeHook, GlobalConfig } from "payload";

const revalidateFrontPageHook: GlobalAfterChangeHook = async () => {
  revalidatePath("/fi");
  revalidatePath("/en");
};

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
      localized: true,
      maxRows: 1,
      blocks: [heroBlock],
    },
    {
      name: "content",
      type: "blocks",
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
  hooks: {
    afterChange: [revalidateFrontPageHook],
  },
};
