import { Config } from "../payload-types";
type CollectionTypes = keyof Config["collections"];

type InternalLink = {
  relationTo: CollectionTypes;
  value: number | { slug: string; title: string };
};

type ExternalLink = {
  url: string;
};

type LinkType = {
  internalUrl?: InternalLink | null;
  externalUrl?: string | null;
  label?: string | null;
};

type ParsedLink = {
  linkUrl?: string;
  linkLabel?: string;
};

export function parseInternalUrl(link?: InternalLink | null) {
  if (!link) return undefined;
  if (typeof link.value === "object" && "slug" in link.value) {
    return `/${link.relationTo}/${link.value.slug}`;
  }
}

export function parseExternalUrl(link?: string | ExternalLink | null) {
  if (!link) return undefined;
  if (typeof link === "string") return link;
  return link.url;
}

export function parseUrl(link?: LinkType | null) {
  if (!link) return undefined;
  if (link.internalUrl) return parseInternalUrl(link.internalUrl);
  if (link.externalUrl) return parseExternalUrl(link.externalUrl);
}

export function parseLabel(link?: LinkType | null) {
  if (!link) return undefined;
  if (link.internalUrl && typeof link.internalUrl.value === "object")
    return link.label ?? link.internalUrl.value.title;
  if (link.externalUrl) return link.label ?? link.externalUrl;
}

export function parseLink(link?: LinkType | null): ParsedLink {
  return {
    linkUrl: parseUrl(link),
    linkLabel: parseLabel(link),
  };
}
