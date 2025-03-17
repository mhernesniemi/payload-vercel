import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { SITE_NAME } from "@/lib/constants";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export default async function ArticlesPage() {
  try {
    const currentPage = 1;
    const perPage = 40;

    const payload = await getPayload({
      config: configPromise,
    });

    const {
      docs: articles,
      totalPages,
      totalDocs,
    } = await payload.find({
      collection: "articles",
      sort: "-publishedDate",
      locale: "fi",
      draft: false,
      limit: perPage,
      page: currentPage,
      depth: 0,
    });

    return (
      <ListingTemplate
        articles={articles}
        totalDocs={totalDocs}
        totalPages={totalPages}
        currentPage={currentPage}
        locale="fi"
      />
    );
  } catch (error) {
    console.error("Error fetching articles:", error);
    return <ErrorTemplate error={error as Error} />;
  }
}

export async function generateMetadata() {
  const t = await getTranslations("articles");

  return {
    title: `${t("title")} | ${SITE_NAME}`,
  };
}
