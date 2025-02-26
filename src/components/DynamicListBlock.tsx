import { DynamicListBlock as DynamicListBlockType } from "@/payload-types";
import Heading from "./Heading";
import Card from "./Card";
import { Fragment } from "react";

type Props = {
  block: DynamicListBlockType;
};

export default function DynamicListBlock({ block }: Props) {
  const items = block.items?.map((item) => item.reference.value);
  console.log("items", items);
  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-6">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <Fragment key={item.id}>
            <Card title={item.title} href={item.slug} image={item.heroImage} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
