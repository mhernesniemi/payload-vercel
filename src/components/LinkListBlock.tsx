import { LinkListBlock as LinkListBlockType } from "@/payload-types";
import { Link } from "@/i18n/routing";

type Props = {
  block: LinkListBlockType;
};

export function LinkListBlock({ block }: Props) {
  return (
    <div className="my-12 rounded-xl bg-stone-900 p-8 shadow-xl ring-1 ring-stone-800">
      <h3 className="mb-6 text-2xl font-bold text-stone-100">{block.blockName}</h3>
      <ul className="space-y-3">
        {block.links?.map((link) => (
          <li key={link.id}>
            <Link
              href={getUrl(link)}
              className="inline-flex items-center text-stone-300 hover:text-stone-100 hover:underline"
            >
              <span>{link.id || "Untitled"}</span>
              {link.isExternal && (
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
          </li>
        ))}
      </ul>
    </div>
  );
}

type Link = NonNullable<LinkListBlockType["links"]>[number];

const getUrl = (link: Link): string => {
  if (link.isExternal && link.externalUrl) {
    return link.externalUrl;
  }

  const internalValue = link.internalUrl?.value;
  if (internalValue && typeof internalValue === "object" && "slug" in internalValue) {
    return `/articles/${internalValue.slug}`;
  }

  return "/";
};
