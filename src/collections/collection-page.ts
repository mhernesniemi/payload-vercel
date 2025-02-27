import { CollectionConfig } from "payload";
import { defaultContentFields } from "@/fields/default-content-fields";
import { afterChangeHook, afterDeleteHook } from "./hooks/indexToElastic";

export const CollectionPage: CollectionConfig = {
  slug: "collection-pages",
  admin: {
    useAsTitle: "title",
    group: "Pages",
  },
  fields: defaultContentFields,
  hooks: {
    afterChange: [afterChangeHook],
    afterDelete: [afterDeleteHook],
  },
};
