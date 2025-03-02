import { linkFieldWithLabel } from "@/fields/link";
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
      admin: {
        components: {
          RowLabel: "@/components/admin-ui/MainMenuRow#MainMenuRow",
        },
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "addLinks",
          type: "checkbox",
          label: "This is a parent menu item",
        },
        {
          name: "link",
          type: "group",
          fields: linkFieldWithLabel,
          admin: {
            condition: (_, siblingData) => !siblingData.addLinks,
          },
        },
        {
          name: "children",
          type: "array",
          admin: {
            condition: (_, siblingData) => siblingData.addLinks,
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "addLinks",
              type: "checkbox",
              label: "This is a parent menu item",
            },
            {
              name: "link",
              type: "group",
              fields: linkFieldWithLabel,
              admin: {
                condition: (_, siblingData) => !siblingData.addLinks,
              },
            },
            {
              name: "grandchildren",
              type: "array",
              admin: {
                condition: (_, siblingData) => siblingData.addLinks,
              },
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
                  fields: linkFieldWithLabel,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
