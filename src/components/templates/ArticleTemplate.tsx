import { BlockRenderer, NodeTypes } from "@/components/BlockRenderer";
import { formatDateShort } from "@/lib/utils";
import { Article } from "@/payload-types";
import { useLocale } from "next-intl";
import Image from "next/image";
import Heading from "../Heading";

interface ArticleTemplateProps {
  article: Article;
}

export default function ArticleTemplate({ article }: ArticleTemplateProps) {
  const locale = useLocale();
  return (
    <main id="main-content" className="mx-auto max-w-[800px] py-12">
      {typeof article.image === "object" && article.image?.url && (
        <Image
          src={article.image.sizes?.large?.url || article.image.url}
          alt={article.image.alt || ""}
          width={1920}
          height={1080}
          className="mb-10 aspect-video w-full max-w-[800px] rounded-lg object-cover"
          priority
        />
      )}
      <Heading level="h1" size="lg" className="mb-6">
        {article.title}
      </Heading>
      <div className="mb-12 flex gap-4 text-sm text-stone-400">
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
      <div className="mx-auto max-w-screen-lg">
        <BlockRenderer nodes={article.content?.root?.children as NodeTypes[]} />
      </div>
    </main>
  );
}
