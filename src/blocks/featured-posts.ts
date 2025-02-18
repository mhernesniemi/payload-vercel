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
      name: "link",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "buttonText",
      type: "text",
    },
    {
      name: "video",
      type: "text",
      admin: {
        description: "YouTube video URL",
      },
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
      name: "link",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
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
