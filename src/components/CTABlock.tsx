import { CTABlock as CTABlockType } from "@/payload-types";

type Props = {
  block: CTABlockType;
};

export function CTABlock({ block }: Props) {
  return (
    <div className="mx-auto my-12 w-full rounded-xl bg-stone-800 p-10 text-center">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">{block.title}</h2>
      {block.text && <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>}
    </div>
  );
}
