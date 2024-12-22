import { Block } from "payload";

export const mediaBlock: Block = {
  slug: "media",
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "caption",
      type: "text",
    },
  ],
  interfaceName: "MediaBlock",
};
