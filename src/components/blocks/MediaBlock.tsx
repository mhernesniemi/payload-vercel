import { MediaBlock as MediaBlockType } from "@/payload-types";
import Image from "next/image";

type Props = {
  block: MediaBlockType;
};

export function MediaBlock({ block }: Props) {
  return (
    <figure className="my-24">
      {typeof block.media === "object" && block.media.url && (
        <div className="aspect-video overflow-hidden rounded-xl">
          <Image
            src={block.media.url}
            alt={block.media.alt || ""}
            width={1200}
            height={800}
            className="w-full object-cover"
            priority
          />
        </div>
      )}
      {block.caption && (
        <figcaption className="mt-4 text-center text-sm italic text-stone-400">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
