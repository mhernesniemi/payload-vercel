import { LinkListBlock as LinkListBlockType } from "@/payload-types";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parseLink";
import { ChevronRightIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

type Props = {
  block: LinkListBlockType;
};

export function LinkListBlock({ block }: Props) {
  return (
    <div className="my-24">
      <h3 className="mb-6 text-2xl font-bold text-stone-100">{block.blockName}</h3>
      <ul className="space-y-3">
        {block.links?.map((link) => {
          const { linkUrl, linkLabel, isExternal } = parseLink(link);
          return (
            <li key={link.id} className="flex items-center gap-2">
              <Link
                href={linkUrl ?? ""}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-2"
              >
                <ChevronRightIcon className="h-4 w-4 text-amber-500 transition-transform duration-200 group-hover:translate-x-[2px]" />
                <span>{linkLabel}</span>
                {isExternal && <ArrowTopRightOnSquareIcon className="ml-1 inline h-4 w-4" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
