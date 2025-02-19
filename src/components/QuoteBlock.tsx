import { QuoteBlock as QuoteBlockType } from "@/payload-types";

type Props = {
  block: QuoteBlockType;
};

export function QuoteBlock({ block }: Props) {
  return (
    <blockquote className="relative my-12 p-8">
      <span className="absolute -top-4 left-4 font-serif text-7xl text-stone-600">&ldquo;</span>
      <p className="relative mb-6 font-serif text-2xl italic text-stone-100">{block.quote}</p>
      {block.author && (
        <footer className="text-stone-300">
          <cite className="flex items-center gap-2 not-italic">
            <span className="font-medium">{block.author}</span>
            {block.title && (
              <>
                <span className="text-stone-500">•</span>
                <span className="text-stone-400">{block.title}</span>
              </>
            )}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}
