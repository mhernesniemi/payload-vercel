import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { parseLink } from "@/lib/parseLink";

type Props = {
  block: SmallFeaturedPostsWrapperBlockType;
};

export default function SmallFeaturedPostsBlock({ block }: Props) {
  return (
    <div className="my-24 w-full">
      <h2 className="mb-6 text-2xl font-bold text-stone-100">{block.blockName}</h2>
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
                <h3 className="mb-2 text-xl font-bold text-stone-100 group-hover:text-amber-500">
                  <Link href={linkUrl || ""}>
                    <span className="absolute inset-x-0 inset-y-0 z-10"></span>
                    <span>{post.title}</span>
                  </Link>
                </h3>
                {post.text && <p className="mb-4 line-clamp-2 text-stone-300">{post.text}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
