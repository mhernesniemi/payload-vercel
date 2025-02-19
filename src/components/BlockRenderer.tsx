import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type {
  CTABlock as CTABlockType,
  LinkListBlock as LinkListBlockType,
  MediaBlock as MediaBlockType,
  QuoteBlock as QuoteBlockType,
  VideoEmbedBlock as VideoEmbedBlockType,
  LargeFeaturedPostBlock as LargeFeaturedPostBlockType,
  SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType,
  ContactsBlock as ContactsBlockType,
} from "@/payload-types";
import { CTABlock } from "./CTABlock";
import { MediaBlock } from "./MediaBlock";
import { QuoteBlock } from "./QuoteBlock";
import { VideoEmbedBlock } from "./VideoEmbedBlock";
import { ContactsBlock } from "./ContactsBlock";
import { LinkListBlock } from "./LinkListBlock";
import { LargeFeaturedPostBlock } from "./LargeFeaturedPostBlock";
import { SmallFeaturedPostsWrapperBlock } from "./SmallFeaturedPostsWrapperBlock";

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockType
      | MediaBlockType
      | QuoteBlockType
      | VideoEmbedBlockType
      | LinkListBlockType
      | LargeFeaturedPostBlockType
      | SmallFeaturedPostsWrapperBlockType
      | ContactsBlockType
    >;

type Props = {
  nodes: NodeTypes[];
};

export const BlockRenderer = ({ nodes }: Props) => {
  if (!nodes) return null;

  return nodes.map((node) => {
    if (node.type === "block") {
      const block = node.fields;
      const blockType = block?.blockType;

      switch (blockType) {
        case "cta":
          return <CTABlock key={block.id} block={block} />;
        case "media":
          return <MediaBlock key={block.id} block={block} />;
        case "quote":
          return <QuoteBlock key={block.id} block={block} />;
        case "videoEmbed":
          return <VideoEmbedBlock key={block.id} block={block} />;
        case "contacts":
          return <ContactsBlock key={block.id} block={block} />;
        case "linkList":
          return <LinkListBlock key={block.id} block={block} />;
        case "largeFeaturedPost":
          return <LargeFeaturedPostBlock key={block.id} block={block} />;
        case "smallFeaturedPostsWrapper":
          return <SmallFeaturedPostsWrapperBlock key={block.id} block={block} />;
        default:
          return null;
      }
    }
  });
};
