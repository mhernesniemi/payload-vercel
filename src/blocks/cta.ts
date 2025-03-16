import { linkFieldWithLabel } from "@/fields/link";
import { Block } from "payload";

export const ctaBlock: Block = {
  slug: "cta",
  labels: {
    singular: "Call to Action",
    plural: "Call to Actions",
  },
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
      type: "group",
      fields: [...linkFieldWithLabel],
    },
  ],
  interfaceName: "CTABlock",
};
