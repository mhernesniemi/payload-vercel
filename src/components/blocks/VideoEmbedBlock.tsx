import { VideoEmbedBlock as VideoEmbedBlockType } from "@/payload-types";
import { YouTubeEmbed } from "@next/third-parties/google";
import Heading from "../Heading";

type Props = {
  block: VideoEmbedBlockType;
};

export function VideoEmbedBlock({ block }: Props) {
  return (
    <div className="my-24">
      {block.blockName && (
        <Heading size="md" level="h2">
          {block.blockName}
        </Heading>
      )}
      <div className="relative overflow-hidden rounded-xl shadow-xl ring-1 ring-stone-800 aspect-video">
        <YouTubeEmbed videoid={block.youtubeId} playlabel={block.title || "Toista video"} />
      </div>
      {block.description && (
        <p className="mt-4 leading-relaxed text-stone-300">{block.description}</p>
      )}
    </div>
  );
}
