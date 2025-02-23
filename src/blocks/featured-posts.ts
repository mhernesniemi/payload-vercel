import { linkField } from "@/fields/link";
import { Block } from "payload";

export const largeFeaturedPostBlock: Block = {
  slug: "largeFeaturedPost",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "text",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "video",
      type: "text",
      admin: {
        description: "YouTube video URL",
      },
    },
    {
      name: "link",
      type: "group",
      fields: [...linkField],
    },
  ],
  interfaceName: "LargeFeaturedPostBlock",
};

export const smallFeaturedPostBlock: Block = {
  slug: "smallFeaturedPost",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "text",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "link",
      type: "group",
      fields: [...linkField],
    },
  ],
};

export const smallFeaturedPostsWrapperBlock: Block = {
  slug: "smallFeaturedPostsWrapper",
  labels: {
    singular: "Small Featured Posts",
    plural: "Small Featured Posts",
  },
  fields: [
    {
      name: "posts",
      type: "blocks",
      blocks: [smallFeaturedPostBlock],
      required: true,
    },
  ],
  interfaceName: "SmallFeaturedPostsWrapperBlock",
};
