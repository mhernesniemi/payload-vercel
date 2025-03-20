import { Config } from "../payload-types";
type CollectionTypes = keyof Config["collections"];

export type InternalLink = {
  relationTo: CollectionTypes;
  value: number | { slug: string; title: string };
};

export type LinkType = {
  internalUrl?: InternalLink | null;
  externalUrl?: string | null;
  label?: string | null;
  isExternal?: boolean | null;
};

export type MenuItem = {
  label: string;
  onlyLabel: null | string;
  link: LinkType;
  children?: MenuItem[];
  grandchildren?: MenuItem[];
  id: string;
  addLinks: boolean;
};
