import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { formatDateShort } from "@/lib/utils";
import { Article } from "@/payload-types";
import { useLocale } from "next-intl";
import Image from "next/image";

interface ArticleTemplateProps {
  article: Article;
}

export default function ArticleTemplate({ article }: ArticleTemplateProps) {
  const locale = useLocale();
  return (
    <main id="main-content" className="mx-auto max-w-[800px] py-16">
      {typeof article.image === "object" && article.image?.url && (
        <Image
          src={article.image.sizes?.large?.url || article.image.url}
          alt={article.image.alt || ""}
          width={1920}
          height={1080}
          className="mb-8 aspect-video w-full max-w-[800px] rounded-lg object-cover"
          priority
        />
      )}
      <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
      <div className="mb-8 flex gap-4 text-stone-400">
        <time dateTime={article.publishedDate || ""}>
          {formatDateShort(article.publishedDate || "", locale)}
        </time>
        {typeof article.author === "object" && (
          <>
            <span>•</span>
            <span>{article.author?.name}</span>
          </>
        )}
      </div>
      <div className="mx-auto mt-12 max-w-screen-lg">
        <BlockRenderer nodes={article.content?.root?.children as NodeTypes[]} />
      </div>
    </main>
  );
}
