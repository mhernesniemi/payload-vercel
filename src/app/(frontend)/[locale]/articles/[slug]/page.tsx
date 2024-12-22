import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { NodeTypes, serializeBlocks } from "@/components/serialize";

type Params = Promise<{ locale: "fi" | "en"; slug: string }>;

async function getArticleBySlug(slug: string, locale: "fi" | "en") {
  const payload = await getPayload({
    config: configPromise,
  });

  return payload
    .find({
      collection: "articles",
      where: {
        slug: { equals: slug },
      },
      locale: locale,
    })
    .then((res) => res.docs[0]);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) return {};

  return {
    title: article.title,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <article>
        {typeof article.heroImage === "object" && (
          <Image
            src={article.heroImage?.url ?? ""}
            alt={article.heroImage?.alt ?? ""}
            width={1920}
            height={1080}
            className="mb-8 h-[400px] w-full rounded-lg object-cover"
          />
        )}
        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>
        <div className="mb-8 flex gap-4 text-gray-600">
          <time dateTime={article.publishedDate}>
            {new Date(article.publishedDate).toLocaleDateString("fi-FI")}
          </time>
          <span>•</span>
          <span>{typeof article.author === "object" && article.author.email}</span>
        </div>
        <div className="mt-4">
          {serializeBlocks({
            nodes: article.content?.root?.children as NodeTypes[],
          })}
        </div>
      </article>
    </main>
  );
}
