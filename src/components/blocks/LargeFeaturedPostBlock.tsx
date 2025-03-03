import { parseLink } from "@/lib/parse-link";
import { LargeFeaturedPostBlock as LargeFeaturedPostBlockType } from "@/payload-types";
import Image from "next/image";
import Button from "../Button";

type Props = {
  block: LargeFeaturedPostBlockType;
};

export function LargeFeaturedPostBlock({ block }: Props) {
  const { linkUrl, linkLabel } = parseLink(block.link);
  return (
    <div className="my-24 w-full text-center">
      <div className="overflow-hidden rounded-xl bg-stone-800">
        {typeof block.image === "object" && block.image.url && (
          <div className="relative h-[400px] w-full">
            <Image
              src={block.image.url}
              alt={block.image.alt || block.title || ""}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="p-8">
          <h2 className="mb-4 text-3xl font-bold text-stone-100">{block.title}</h2>
          <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>
          {linkUrl && (
            <div className="mt-6 flex justify-center">
              <Button href={linkUrl} style="secondary">
                {linkLabel || "Read more"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
