import { LinkListBlock } from "../payload-types";

type Link = NonNullable<LinkListBlock["links"]>[number];

interface LinkData {
  url: string;
  isExternal: boolean;
  title?: string;
}

const parseLink = (link: Link): LinkData => {
  const isExternal = link.isExternal ?? false;
  let url = "/";
  let title;

  if (isExternal && link.externalUrl) {
    url = link.externalUrl;
  } else {
    const internalValue = link.internalUrl?.value;
    if (internalValue && typeof internalValue === "object" && "slug" in internalValue) {
      const relationTo = link.internalUrl?.relationTo;
      url = relationTo ? `/${relationTo}/${internalValue.slug}` : `/${internalValue.slug}`;

      // Get title from relation if available
      if ("title" in internalValue) {
        title = internalValue.title as string;
      }
    }
  }

  return {
    url,
    isExternal,
    ...(title && { title }),
  };
};

export default parseLink;
