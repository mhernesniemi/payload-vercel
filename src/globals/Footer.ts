import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  admin: {
    group: "Misc",
  },
  fields: [
    {
      name: "general",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
        },
        {
          name: "description",
          type: "text",
          localized: true,
        },
        {
          name: "social",
          type: "group",
          fields: [
            {
              name: "facebook",
              type: "text",

              localized: true,
              admin: { description: "Link URL" },
            },
            {
              name: "instagram",
              type: "text",

              localized: true,
              admin: { description: "Link URL" },
            },
            {
              name: "linkedin",
              type: "text",

              localized: true,
              admin: { description: "Link URL" },
            },
            {
              name: "youtube",
              type: "text",

              localized: true,
              admin: { description: "Link URL" },
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "address", type: "text", localized: true },
        { name: "postalCode", type: "text", localized: true },
        { name: "city", type: "text", localized: true },
        { name: "phone", type: "text", localized: true },
        { name: "email", type: "text", localized: true },
      ],
    },
    {
      name: "copyright",
      type: "text",
      localized: true,
    },
  ],
};
