import Image from "next/image";
import { MediaBlock as MediaBlockType } from "@/payload-types";

type Props = {
  block: MediaBlockType;
};

export function MediaBlock({ block }: Props) {
  return (
    <figure className="my-12">
      {block.media && typeof block.media === "object" && (
        <div className="relative overflow-hidden rounded-xl shadow-xl ring-1 ring-stone-800">
          <Image
            src={block.media.url || ""}
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
