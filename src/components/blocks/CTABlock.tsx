import { CTABlock as CTABlockType } from "@/payload-types";
import Heading from "../Heading";
type Props = {
  block: CTABlockType;
};

export function CTABlock({ block }: Props) {
  return (
    <div className="mx-auto my-24 w-full rounded-xl bg-stone-800 p-10 text-center">
      <Heading level="h2" size="lg" className="mb-6">
        {block.title}
      </Heading>
      {block.text && <p className="text-lg leading-relaxed text-stone-300">{block.text}</p>}
    </div>
  );
}
