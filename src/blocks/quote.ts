import { Block } from "payload";

export const quoteBlock: Block = {
  slug: "quote",
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "author",
      type: "text",
    },
    {
      name: "title",
      type: "text",
      admin: {
        description: "Author's title or role",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Author's image",
      },
    },
  ],
  interfaceName: "QuoteBlock",
};
