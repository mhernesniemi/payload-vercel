import Container from "@/components/Container";
import Header from "@/components/Header";
import ArticleTemplate from "@/components/templates/ArticleTemplate";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import configPromise from "@payload-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Props = {
  params: Promise<{ locale: "fi" | "en"; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getArticleBySlug({ params, searchParams }: Props) {
  try {
    const { slug, locale } = await params;
    const preview = (await searchParams).preview as string;
    const previewMode = preview === process.env.PREVIEW_SECRET;

    const payload = await getPayload({
      config: configPromise,
    });

    const result = await payload.find({
      collection: "articles",
      where: {
        slug: { equals: slug },
      },
      locale: locale,
      draft: previewMode,
    });

    return { article: result.docs[0], error: null };
  } catch (error) {
    console.error("Error fetching article:", error);
    return { article: null, error: error as Error };
  }
}

export default async function ArticlePage(props: Props) {
  const { article, error } = await getArticleBySlug(props);

  if (error) {
    console.error("Error fetching article:", error);
    return <ErrorTemplate error={error} />;
  }

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
  const { article } = await getArticleBySlug(props);
  if (!article) return {};
  const openGraphImages = prepareOpenGraphImages(article.meta?.image);

  return {
    title: article.meta?.title || `${article.title} | ${SITE_NAME}`,
    description: article.meta?.description || article.description,
    openGraph: openGraphImages ? { images: openGraphImages } : undefined,
  };
}
