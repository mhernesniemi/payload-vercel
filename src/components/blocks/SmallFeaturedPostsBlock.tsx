import { parseLink } from "@/lib/parse-link";
import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";
import Card from "../Card";
import Heading from "../Heading";

type Props = {
  block: SmallFeaturedPostsWrapperBlockType;
};

export default function SmallFeaturedPostsBlock({ block }: Props) {
  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {block.posts.map((post) => {
          const { linkUrl } = parseLink(post.link);
          if (linkUrl) {
            return (
              <Card
                key={post.id}
                image={typeof post.image === "object" ? post.image : undefined}
                title={post.title}
                text={post.text}
                href={linkUrl}
              />
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
