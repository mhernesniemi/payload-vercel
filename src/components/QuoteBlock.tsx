import { QuoteBlock as QuoteBlockType } from "@/payload-types";
import Image from "next/image";

type Props = {
  block: QuoteBlockType;
};

export function QuoteBlock({ block }: Props) {
  return (
    <blockquote className="relative mx-auto my-24 max-w-3xl p-8">
      <span className="absolute -top-4 left-4 font-serif text-7xl text-stone-600">&ldquo;</span>
      <p className="relative mb-6 font-serif text-2xl italic text-stone-100">{block.quote}</p>
      {block.author && (
        <footer className="text-stone-300">
          <cite className="flex items-center gap-4 not-italic">
            {block.image && typeof block.image !== "number" && block.image.url && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={block.image.url} alt={block.author} fill className="object-cover" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{block.author}</span>
                {block.title && (
                  <>
                    <span className="text-stone-500">•</span>
                    <span className="text-stone-400">{block.title}</span>
                  </>
                )}
              </div>
            </div>
          </cite>
        </footer>
      )}
    </blockquote>
  );
}
