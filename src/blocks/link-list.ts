import { linkField } from "@/fields/link";
import { Block } from "payload";

export const linkListBlock: Block = {
  slug: "linkList",
  fields: [
    {
      name: "links",
      type: "array",
      fields: [...linkField],
    },
  ],
  interfaceName: "LinkListBlock",
};
