import { Block } from "payload";

export const quoteBlock: Block = {
  slug: "quote",
  fields: [
    {
      name: "quote",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "author",
      type: "text",
      localized: true,
    },
    {
      name: "title",
      type: "text",
      localized: true,
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
