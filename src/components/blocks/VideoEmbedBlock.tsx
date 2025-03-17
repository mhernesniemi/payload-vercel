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

      <YouTubeEmbed videoid={block.youtubeId} playlabel={block.title || "Toista video"} />

      {block.description && (
        <p className="mt-4 leading-relaxed text-stone-300">{block.description}</p>
      )}
    </div>
  );
}
