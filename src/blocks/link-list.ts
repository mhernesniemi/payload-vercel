import { linkFieldWithLabel } from "@/fields/link";
import { Block } from "payload";

export const linkListBlock: Block = {
  slug: "linkList",
  fields: [
    {
      name: "links",
      type: "array",
      localized: true,
      fields: [...linkFieldWithLabel],
    },
  ],
  interfaceName: "LinkListBlock",
};
