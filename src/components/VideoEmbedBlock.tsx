import { VideoEmbedBlock as VideoEmbedBlockType } from "@/payload-types";

type Props = {
  block: VideoEmbedBlockType;
};

export function VideoEmbedBlock({ block }: Props) {
  return (
    <div className="my-12">
      {block.title && <h3 className="mb-6 text-2xl font-bold text-stone-100">{block.title}</h3>}
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-xl ring-1 ring-stone-800">
        <iframe
          src={`https://www.youtube.com/embed/${block.youtubeId}`}
          className="absolute inset-0 h-full w-full"
          title={block.title || "YouTube video"}
          allowFullScreen
          loading="lazy"
        />
      </div>
      {block.description && (
        <p className="mt-4 leading-relaxed text-stone-300">{block.description}</p>
      )}
    </div>
  );
}
