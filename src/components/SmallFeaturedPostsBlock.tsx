import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parseLink";
import Heading from "./Heading";

type Props = {
  block: SmallFeaturedPostsWrapperBlockType;
};

export default function SmallFeaturedPostsBlock({ block }: Props) {
  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-6">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {block.posts.map((post) => {
          const { linkUrl } = parseLink(post.link);
          return (
            <li key={post.id} className="group relative overflow-hidden rounded-xl bg-stone-800">
              {typeof post.image === "object" && post.image.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image.url}
                    alt={post.image.alt || post.title || ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <Link href={linkUrl || ""} className="block">
                  <span className="absolute inset-x-0 inset-y-0 z-10"></span>
                  <Heading level="h2" size="sm" className="mb-2 group-hover:text-amber-500">
                    {post.title}
                  </Heading>
                </Link>
                {post.text && <p className="mb-4 line-clamp-2 text-stone-300">{post.text}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
