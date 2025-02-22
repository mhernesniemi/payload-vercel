import Image from "next/image";
import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { Article } from "@/payload-types";

interface ArticleTemplateProps {
  article: Article;
}

export default function ArticleTemplate({ article }: ArticleTemplateProps) {
  const heroImage = article.heroImage as { url: string; alt: string };
  return (
    <article className="py-16">
      {heroImage?.url && (
        <Image
          src={heroImage.url}
          alt={heroImage.alt || ""}
          width={1920}
          height={1080}
          className="mb-8 h-[400px] w-full rounded-lg object-cover"
        />
      )}
      <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
      {/* <div className="mb-8 flex gap-4 text-stone-400">
        <time dateTime={article.publishedDate}>
          {new Date(article.publishedDate).toLocaleDateString("fi-FI")}
        </time>
        <span>•</span>
        <span>{typeof article.author === "object" && article.author.email}</span>
      </div> */}
      <div className="mx-auto mt-12 max-w-screen-lg">
        <BlockRenderer nodes={article.content?.root?.children as NodeTypes[]} />
      </div>
    </article>
  );
}
