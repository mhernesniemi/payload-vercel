import { Block } from "payload";

export const heroBlock: Block = {
  slug: "hero",
  labels: {
    singular: "Hero",
    plural: "Heroes",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Image",
    },
    {
      name: "ctaButton",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Button text",
        },
        {
          name: "link",
          type: "text",
          required: true,
          label: "Link",
        },
      ],
    },
  ],
  interfaceName: "HeroBlock",
};
