import React from "react";
import { LinkListBlock } from "../payload-types";
import { Link } from "@/i18n/routing";
import parseLink from "@/lib/parseLink";

type Link = NonNullable<LinkListBlock["links"]>[number];

type CMSLinkProps = {
  link: Link;
  className?: string;
};

export function CMSLink({ link, className }: CMSLinkProps) {
  const { url, isExternal, title } = parseLink(link);

  return (
    <Link
      href={url}
      className={className}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {title}
      {isExternal && (
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </Link>
  );
}
