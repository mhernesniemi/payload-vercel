import configPromise from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import Container from "@/components/Container";
import ArticleTemplate from "@/app/templates/ArticleTemplate";
import Header from "@/components/Header";

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getArticleBySlug({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const { slug, locale } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const preview = resolvedSearchParams.preview as string;

  const payload = await getPayload({
    config: configPromise,
  });

  const previewMode = preview === process.env.PREVIEW_SECRET;

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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const article = await getArticleBySlug(props);

  if (!article) return {};

  return {
    title: `${article.title} | ${SITE_NAME}`,
  };
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
