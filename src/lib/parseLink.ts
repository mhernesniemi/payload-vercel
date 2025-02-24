type LinkData = {
  label: string | null | undefined;
  externalUrl?: string | null;
  internalUrl?: {
    relationTo: "articles" | "collection-pages" | "news";
    value: number | { slug: string; title: string };
  } | null;
};

export default function parseLink(data: LinkData = { label: "" }) {
  const { label, externalUrl, internalUrl } = data;
  const isExternal = !!externalUrl;

  let url = "/";
  let title: string | undefined;

  if (isExternal && externalUrl) {
    url = externalUrl;
  } else if (internalUrl) {
    const { relationTo, value } = internalUrl;
    if (typeof value === "object" && "slug" in value) {
      url = `/${relationTo}/${value.slug}`;
      title = label ?? value.title;
    }
  }

  return {
    url,
    isExternal,
    title,
  };
}
