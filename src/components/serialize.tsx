import { Link } from "@/i18n/routing";
import Image from "next/image";
import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { useTranslations } from "next-intl";
import type {
  ContactPeopleBlock,
  CTABlock,
  LinkListBlock,
  MediaBlock,
  QuoteBlock,
  VideoEmbedBlock,
} from "@/payload-types";

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      CTABlock | MediaBlock | QuoteBlock | VideoEmbedBlock | LinkListBlock | ContactPeopleBlock
    >;

type Props = {
  nodes: NodeTypes[];
};

export const serializeBlocks = ({ nodes }: Props) => {
  if (!nodes) return null;

  return nodes.map((node) => {
    if (node.type === "block") {
      const block = node.fields;
      const blockType = block?.blockType;

      switch (blockType) {
        case "cta":
          return (
            <div key={block.id} className="my-8 rounded-lg bg-gray-50 p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">{block.title}</h2>
              {block.text && <p className="mb-6 text-gray-600">{block.text}</p>}
              {/* <Link
                href={block}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              >
                {block.linkText}
              </Link> */}
            </div>
          );

        case "media":
          return (
            <figure key={block.id} className="my-8">
              {block.media && typeof block.media === "object" && (
                <Image
                  src={block.media.url || ""}
                  alt={block.media.alt || ""}
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              )}
              {block.caption && (
                <figcaption className="mt-2 text-center text-sm text-gray-500">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );

        case "quote":
          return (
            <blockquote key={block.id} className="my-8 border-l-4 border-blue-500 bg-gray-50 p-8">
              <p className="mb-4 text-xl italic">{block.quote}</p>
              {block.author && (
                <footer className="text-gray-600">
                  <cite>
                    {block.author}
                    {block.title && <span className="ml-2 text-gray-400">— {block.title}</span>}
                  </cite>
                </footer>
              )}
            </blockquote>
          );

        case "videoEmbed":
          return (
            <div key={block.id} className="my-8">
              <h3 className="mb-4 text-xl font-bold">{block.title}</h3>
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${block.youtubeId}`}
                  className="absolute inset-0 h-full w-full rounded-lg"
                  allowFullScreen
                />
              </div>
              {block.description && <p className="mt-4 text-gray-600">{block.description}</p>}
            </div>
          );

        case "contactPeople":
          return (
            <div key={block.id} className="my-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {block.contacts?.map((contact: any) => (
                <div key={contact.id} className="rounded-lg border p-6">
                  <h3 className="mb-2 font-bold">{contact.name}</h3>
                  {contact.title && <p className="mb-4 text-sm text-gray-500">{contact.title}</p>}
                  <p className="text-gray-600">{contact.email}</p>
                </div>
              ))}
            </div>
          );

        case "linkList":
          return (
            <div key={block.id} className="my-8">
              <h3 className="mb-4 text-xl font-bold">{block.blockName}</h3>
              <ul className="space-y-2">
                {block.links?.map((link: any) => (
                  <li key={link.id}>
                    <Link
                      href={
                        link.isExternal ? link.externalUrl : `/articles/${link.internalUrl.slug}`
                      }
                      className="text-blue-600 hover:underline"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );

        default:
          return null;
      }
    }
  });
};

// export const Serialize = ({ nodes }: Props) => {
//   if (!nodes) return null;
//   return <>{nodes.map((block) => serializeBlock(block))}</>;
// };
