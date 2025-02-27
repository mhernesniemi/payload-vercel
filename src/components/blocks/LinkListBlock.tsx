import { LinkListBlock as LinkListBlockType } from "@/payload-types";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parse-link";
import { ChevronRightIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import Heading from "../Heading";
type Props = {
  block: LinkListBlockType;
};

export function LinkListBlock({ block }: Props) {
  return (
    <div className="my-24">
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-6">
          {block.blockName}
        </Heading>
      )}
      <ul className="space-y-3">
        {block.links?.map((link) => {
          const { linkUrl, linkLabel, isExternal } = parseLink(link);
          if (linkUrl) {
            return (
              <li key={link.id} className="flex items-center gap-2">
                <Link
                  href={linkUrl ?? ""}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-2 hover:text-amber-500"
                >
                  <ChevronRightIcon className="h-4 w-4 text-amber-500 transition-transform duration-200 group-hover:translate-x-[2px]" />
                  <span>{linkLabel}</span>
                  {isExternal && <ArrowTopRightOnSquareIcon className="ml-1 inline h-4 w-4" />}
                </Link>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
