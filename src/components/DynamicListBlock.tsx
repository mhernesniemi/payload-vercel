import {
  DynamicListBlock as DynamicListBlockType,
  Article,
  News,
  CollectionPage,
  Contact,
} from "@/payload-types";
import Heading from "./Heading";
import Card from "./Card";
import { Fragment, useEffect, useState } from "react";
import { fetchDynamicList } from "@/actions";

type Props = {
  block: DynamicListBlockType;
};

type CollectionItem = Article | News | CollectionPage | Contact;

const getItemData = (item: CollectionItem) => {
  if ("name" in item) {
    // Contact
    return {
      image: typeof item.image === "object" && item.image !== null ? item.image : undefined,
      title: item.name,
      text: item.title || "",
      href: `/contacts/${item.id}`,
    };
  }

  // Article, News, CollectionPage
  return {
    image:
      typeof item.heroImage === "object" && item.heroImage !== null ? item.heroImage : undefined,
    title: item.title,
    text: item.heroText || "",
    href: `/${item.slug}`,
  };
};

export default function DynamicListBlock({ block }: Props) {
  const [items, setItems] = useState<CollectionItem[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const result = await fetchDynamicList(
        block.collections,
        block.sortBy,
        block.sortOrder,
        block.limit,
      );
      setItems(result);
    };

    loadItems();
  }, [block.collections, block.sortBy, block.sortOrder, block.limit]);

  console.log("items", items);

  return (
    <div className="my-24 w-full">
      {block.blockName && (
        <Heading level="h2" size="md" className="mb-6">
          {block.blockName}
        </Heading>
      )}
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Fragment key={item.id}>
            <Card {...getItemData(item)} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
