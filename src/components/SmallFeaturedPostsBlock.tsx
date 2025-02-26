import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType } from "@/payload-types";
import Heading from "./Heading";
import Card from "./Card";
import { parseLink } from "@/lib/parseLink";
import { Fragment } from "react";

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
          if (linkUrl) {
            return (
              <Fragment key={post.id}>
                <Card
                  key={post.id}
                  image={typeof post.image === "object" ? post.image : undefined}
                  title={post.title}
                  text={post.text}
                  href={linkUrl}
                />
              </Fragment>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
