import { CollectionConfig } from "payload";
import { slugField } from "@/fields/slug";
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    group: "Taxonomy",
    useAsTitle: "label",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
      admin: {
        components: {
          Cell: "@/components/admin-ui/CategoryCell#CategoryCell",
        },
      },
    },
    ...slugField("label"),
  ],
};
