import { ListingTemplate } from "@/components/templates/ListingTemplate";
import configPromise from "@payload-config";

import { getPayload } from "payload";
type Params = Promise<{ locale: "fi" | "en" }>;

export default async function ArticlesPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { page?: string };
}) {
  const { locale } = await params;
  const currentPage = Number(searchParams.page) || 1;
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
    locale: locale,
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
      locale={locale}
    />
  );
}
