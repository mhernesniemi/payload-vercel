import { linkFieldWithLabel } from "@/fields/link";
import { GlobalConfig } from "payload";

export const FooterMenu: GlobalConfig = {
  slug: "footer-menu",
  access: {
    read: () => true,
  },
  admin: {
    group: "Menus",
  },
  fields: [
    {
      name: "items",
      type: "array",
      required: true,
      localized: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "children",
          type: "array",
          fields: [
            {
              name: "link",
              type: "group",
              fields: linkFieldWithLabel,
            },
          ],
        },
      ],
    },
  ],
};
