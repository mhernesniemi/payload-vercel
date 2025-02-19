import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type {
  CTABlock,
  LinkListBlock,
  MediaBlock,
  QuoteBlock,
  VideoEmbedBlock,
  LargeFeaturedPostBlock as LargeFeaturedPostBlockType,
  SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperBlockType,
  ContactsBlock,
} from "@/payload-types";
import { CTABlock as CTABlockComponent } from "./CTABlock";
import { MediaBlock as MediaBlockComponent } from "./MediaBlock";
import { QuoteBlock as QuoteBlockComponent } from "./QuoteBlock";
import { VideoEmbedBlock as VideoEmbedBlockComponent } from "./VideoEmbedBlock";
import { ContactsBlock as ContactsBlockComponent } from "./ContactsBlock";
import { LinkListBlock as LinkListBlockComponent } from "./LinkListBlock";
import { LargeFeaturedPostBlock as LargeFeaturedPostComponent } from "./LargeFeaturedPostBlock";
import { SmallFeaturedPostsWrapperBlock as SmallFeaturedPostsWrapperComponent } from "./SmallFeaturedPostsWrapperBlock";

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlock
      | MediaBlock
      | QuoteBlock
      | VideoEmbedBlock
      | LinkListBlock
      | LargeFeaturedPostBlockType
      | SmallFeaturedPostsWrapperBlockType
      | ContactsBlock
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
          return <CTABlockComponent key={block.id} block={block} />;
        case "media":
          return <MediaBlockComponent key={block.id} block={block} />;
        case "quote":
          return <QuoteBlockComponent key={block.id} block={block} />;
        case "videoEmbed":
          return <VideoEmbedBlockComponent key={block.id} block={block} />;
        case "contacts":
          return <ContactsBlockComponent key={block.id} block={block} />;
        case "linkList":
          return <LinkListBlockComponent key={block.id} block={block} />;
        case "largeFeaturedPost":
          return <LargeFeaturedPostComponent key={block.id} block={block} />;
        case "smallFeaturedPostsWrapper":
          return <SmallFeaturedPostsWrapperComponent key={block.id} block={block} />;
        default:
          return null;
      }
    }
  });
};
