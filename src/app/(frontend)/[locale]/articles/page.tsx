import Heading from "@/components/Heading";
import { Link } from "@/i18n/routing";
import configPromise from "@payload-config";

import { getPayload } from "payload";
type Params = Promise<{ locale: "fi" | "en" }>;

export default async function ArticlesPage({ params }: { params: Params }) {
  const { locale } = await params;

  const payload = await getPayload({
    config: configPromise,
  });

  const { docs: articles } = await payload.find({
    collection: "articles",
    sort: "-publishedDate",
    locale: locale,
    draft: false,
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
    </main>
  );
}
