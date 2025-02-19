import { LargeFeaturedPostBlock as LargeFeaturedPostBlockType } from "@/payload-types";
import Image from "next/image";
import { Link } from "@/i18n/routing";

type Props = {
  block: LargeFeaturedPostBlockType;
};

export function LargeFeaturedPostBlock({ block }: Props) {
  return (
    <div className="my-12 w-full">
      <div className="overflow-hidden rounded-xl bg-stone-800">
        {block.image && typeof block.image === "object" && (
          <div className="relative h-[400px] w-full">
            <Image
              src={block.image.url || ""}
              alt={block.image.alt || block.title || ""}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="p-8">
          <h3 className="mb-4 text-3xl font-bold text-stone-100">{block.title}</h3>
          <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>
          {block.link && (
            <Link
              href={block.link}
              className="mt-6 inline-block rounded-lg bg-stone-800 px-6 py-3 text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700"
            >
              {block.buttonText || "Read more"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
