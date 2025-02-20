import { MenuItem } from "../components/MainMenu";
import { LinkListBlock } from "../payload-types";

interface LinkData {
  url: string;
  isExternal: boolean;
  title?: string;
}

/**
 * Parses a link from either MenuItem or LinkListBlock item into a standardized LinkData format
 * @param item - MenuItem or LinkListBlock item to parse
 * @returns Parsed link data with url, external status and optional title
 */
const parseLink = (item: MenuItem | NonNullable<LinkListBlock["links"]>[number]): LinkData => {
  // Extract the link object from the item
  const link = "link" in item ? item.link : item;
  const isExternal = link.isExternal ?? false;

  // Default values
  let url = "/";
  let title: string | undefined;

  if (isExternal && link.externalUrl) {
    url = link.externalUrl;
  } else if (link.internalUrl) {
    const { relationTo, value } = link.internalUrl;

    // Handle internal URL with object value containing slug
    if (typeof value === "object" && "slug" in value) {
      url = `/${relationTo}/${value.slug}`;
      title = "title" in value ? value.title : undefined;
    }
  }

  return {
    url,
    isExternal,
    ...(title && { title }),
  };
};

export default parseLink;
