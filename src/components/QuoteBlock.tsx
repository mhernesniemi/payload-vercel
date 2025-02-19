import { QuoteBlock as QuoteBlockType } from "@/payload-types";

type Props = {
  block: QuoteBlockType;
};

export const QuoteBlock: React.FC<Props> = ({ block }) => {
  return (
    <blockquote className="my-12 rounded-xl border-l-4 border-stone-700 bg-stone-900 p-8 shadow-xl ring-1 ring-stone-800">
      <p className="mb-6 font-serif text-2xl italic text-stone-100">{block.quote}</p>
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
};
