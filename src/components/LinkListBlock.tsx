import { LinkListBlock as LinkListBlockType } from "@/payload-types";
import { CMSLink } from "@/components/CMSLink";

type Props = {
  block: LinkListBlockType;
};

export function LinkListBlock({ block }: Props) {
  return (
    <div className="my-12 rounded-xl bg-stone-900 p-8 shadow-xl ring-1 ring-stone-800">
      <h3 className="mb-6 text-2xl font-bold text-stone-100">{block.blockName}</h3>
      <ul className="space-y-3">
        {block.links?.map((link) => (
          <li key={link.id}>
            <CMSLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
