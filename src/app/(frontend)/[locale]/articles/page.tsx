import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
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
  const perPage = 5;

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
    <main id="main-content" className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
      <Heading level="h1" size="lg" className="mb-8">
        Articles
      </Heading>

      {articles.map((article) => (
        <div key={article.id}>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {currentPage > 1 && (
            <Link href={`/articles?page=${currentPage - 1}`}>Edellinen sivu</Link>
          )}
          <span>
            Sivu {currentPage} / {totalPages} (Yhteensä {totalDocs} artikkelia)
          </span>
          {currentPage < totalPages && (
            <Link href={`/articles?page=${currentPage + 1}`}>Seuraava sivu</Link>
          )}
        </div>
      )}
    </main>
  );
}
