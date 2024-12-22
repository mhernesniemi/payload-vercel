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
    <main className="mx-auto flex max-w-screen-md flex-col gap-8 py-16">
      <h1 className="mb-8 text-4xl font-bold">Articles</h1>

      {articles.map((article) => (
        <div key={article.id}>
          <div>{article.title}</div>
          {/* <div>{article.}</div> */}
        </div>
      ))}
    </main>
  );
}
