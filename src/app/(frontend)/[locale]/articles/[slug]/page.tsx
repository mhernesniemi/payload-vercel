import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Container from "@/components/Container";
import ArticleTemplate from "@/app/templates/ArticleTemplate";
import Header from "@/components/Header";
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
    title: `${article.title} | ${SITE_NAME}`,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <ArticleTemplate article={article} />
    </Container>
  );
}
