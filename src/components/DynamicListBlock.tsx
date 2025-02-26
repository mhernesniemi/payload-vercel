import { DynamicListBlock as DynamicListBlockType } from "@/payload-types";
import Heading from "./Heading";
import Card, { CardProps } from "./Card";
import { Fragment } from "react";
import { Media } from "@/payload-types";

type Props = {
  block: DynamicListBlockType;
};

type ItemType = {
  id?: string | number;
  title?: string;
  name?: string;
  slug?: string;
  url?: string;
  heroImage?: Media;
  image?: Media;
};

// Differentiate between different fields for different collection types
const getItemData = (item: ItemType): CardProps => {
  const data: CardProps = {
    title: "",
    href: "",
    image: undefined,
  };

  if ("heroImage" in item) {
    data.image = item.heroImage;
  } else if ("image" in item) {
    data.image = item.image;
  }

  if ("title" in item) {
    data.title = item.title || "";
  } else if ("name" in item) {
    data.title = item.name || "";
  }

  if ("slug" in item) {
    data.href = item.slug || "";
  } else if ("url" in item) {
    data.href = item.url || "";
  }

  return data;
};

export default function DynamicListBlock({ block }: Props) {
  const items = block.items?.map((item) => item.reference.value);
  if (!items) return;

  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-6">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => {
          if (!item || typeof item === "number") return null;
          return (
            <Fragment key={item.id}>
              <Card {...getItemData(item as ItemType)} />
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
