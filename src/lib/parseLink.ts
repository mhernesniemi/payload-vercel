import { Config } from "../payload-types";
type CollectionTypes = keyof Config["collections"];

type InternalLink = {
  relationTo: CollectionTypes;
  value: number | { slug: string; title: string };
};

export default function parseInternalLink(link?: InternalLink | null) {
  if (!link) return undefined;
  if (typeof link.value === "object" && "slug" in link.value) {
    return { url: `/${link.relationTo}/${link.value.slug}` };
  }
  return undefined;
}
