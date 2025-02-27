import Container from "@/components/Container";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations();

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
  });

  return (
    <Container>
      <Header />
      <main id="main-content" className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
        <Heading level="h1" size="lg" className="mb-8">
          {t("articles.title")}
        </Heading>
        {totalDocs && (
          <div className="text-stone-400">
            {t("listing.totalDocs")}: {totalDocs}
          </div>
        )}
        {articles.map((article) => (
          <div
            key={article.id}
            className="group rounded-lg bg-stone-800 p-6 transition-all hover:ring-1 hover:ring-amber-500"
          >
            <Link href={`/articles/${article.slug}`} className="block">
              <h2 className="text-xl font-semibold text-stone-100 group-hover:text-amber-500">
                {article.title}
              </h2>
              {article.publishedDate && (
                <p className="mt-2 text-sm text-stone-400">
                  {new Date(article.publishedDate).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </Link>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-4">
            {currentPage > 1 && (
              <Link
                href={`/articles?page=${currentPage - 1}`}
                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
              >
                {t("listing.previousPage")}
              </Link>
            )}
            <span className="flex items-center text-sm text-stone-400">
              {t("listing.pagination")} {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/articles?page=${currentPage + 1}`}
                className="rounded-md bg-stone-800 px-4 py-2 text-sm font-medium text-stone-100 ring-1 ring-stone-700 transition-colors hover:bg-stone-700 hover:text-amber-500"
              >
                {t("listing.nextPage")}
              </Link>
            )}
          </div>
        )}
      </main>
    </Container>
  );
}
