import Container from "@/components/Container";
import Header from "@/components/Header";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import { SITE_NAME } from "@/lib/constants";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getArticleBySlug({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const preview = (await searchParams).preview as string;
  const previewMode = preview === process.env.PREVIEW_SECRET;

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
      draft: previewMode,
    })
    .then((res) => res.docs[0]);
}

export default async function ArticlePage(props: Props) {
  const article = await getArticleBySlug(props);

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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const article = await getArticleBySlug(props);

  if (!article) return {};

  return {
    title: `${article.title} | ${SITE_NAME}`,
  };
}
