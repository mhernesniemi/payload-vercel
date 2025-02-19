import React from "react";
import { LinkListBlock } from "../payload-types";
import { Link } from "@/i18n/routing";
import parseLink from "@/lib/parseLink";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

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
      {isExternal && <ArrowTopRightOnSquareIcon className="ml-1 inline h-4 w-4" />}
    </Link>
  );
}
