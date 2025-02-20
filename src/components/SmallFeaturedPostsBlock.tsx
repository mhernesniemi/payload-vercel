import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";
import Image from "next/image";
import { Link } from "@/i18n/routing";

type Props = {
  block: SmallFeaturedPostsWrapperBlockType;
};

export default function SmallFeaturedPostsBlock({ block }: Props) {
  return (
    <div className="my-24 w-full">
      <h3 className="mb-6 text-2xl font-bold text-stone-100">{block.blockName}</h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {block.posts.map((post) => (
          <div key={post.id} className="overflow-hidden rounded-xl bg-stone-800">
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
              <h4 className="mb-2 text-xl font-bold text-stone-100">{post.title}</h4>
              {post.text && <p className="mb-4 line-clamp-2 text-stone-300">{post.text}</p>}
              {post.link && (
                <Link
                  href={post.link}
                  className="text-stone-400 hover:text-stone-200 hover:underline"
                >
                  Read more
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
