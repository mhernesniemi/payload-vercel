import { CTABlock as CTABlockType } from "@/payload-types";

type Props = {
  block: CTABlockType;
};

export const CTABlock: React.FC<Props> = ({ block }) => {
  return (
    <div className="mx-auto my-12 w-full max-w-screen-lg rounded-xl bg-stone-900 p-10 text-center shadow-xl ring-1 ring-stone-800">
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-stone-50">{block.title}</h2>
      {block.text && <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>}
    </div>
  );
};
