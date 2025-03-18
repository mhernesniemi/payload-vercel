import ErrorTemplate from "@/components/templates/ErrorTemplate";
import { ListingTemplate } from "@/components/templates/ListingTemplate";
import { SITE_NAME } from "@/lib/constants";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";
import { getPayload } from "payload";

type Params = Promise<{ locale: "fi" | "en" }>;
type LocaleType = "fi" | "en" | "all" | undefined;

// The page cache is invalidated every 5 minutes
export const revalidate = 300;

// Allows dynamic path parameters that are not generated statically
export const dynamicParams = true;

// Generates certain static paths in the build process
export async function generateStaticParams() {
  return [{ locale: "fi" }, { locale: "en" }];
}

// Function that fetches articles in a cacheable way
async function getArticles(locale: LocaleType, page: number = 1, perPage: number = 40) {
  const payload = await getPayload({
    config: configPromise,
  });

  return await payload.find({
    collection: "articles",
    sort: "-publishedDate",
    locale: locale,
    draft: false,
    limit: perPage,
    page: page,
    depth: 0,
  });
}

export default async function ArticlesPage({ params }: { params: Params }) {
  try {
    const { locale } = await params;
    // Use a constant page number of 1 on the static page
    const currentPage = 1;
    const perPage = 40;

    // Use the fetch API's cacheable data source
    const {
      docs: articles,
      totalPages,
      totalDocs,
    } = await getArticles(locale as LocaleType, currentPage, perPage);

    return (
      <ListingTemplate
        articles={articles}
        totalDocs={totalDocs}
        totalPages={totalPages}
        currentPage={currentPage}
        locale={locale}
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
