import { linkField } from "@/fields/link";
import { GlobalConfig } from "payload";

export const MainMenu: GlobalConfig = {
  slug: "main-menu",
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
          name: "onlyLabel",
          type: "checkbox",
          label: "Only show label",
        },
        {
          name: "link",
          type: "group",
          fields: linkField,
          admin: {
            condition: (_, siblingData) => !siblingData.onlyLabel,
          },
        },
        {
          name: "children",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "link",
              type: "group",
              fields: linkField,
            },
          ],
        },
      ],
    },
  ],
};
