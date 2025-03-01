import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  admin: {
    group: "Misc",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "altTextGenerator",
      type: "ui",
      admin: {
        components: {
          Field: {
            path: "@/components/admin-ui/AltTextGenerator",
            clientProps: {
              path: "alt",
            },
          },
        },
      },
    },
  ],
  upload: true,
};
