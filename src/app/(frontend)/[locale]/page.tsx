import configPromise from "@payload-config";
import { getPayload } from "payload";
import FrontPageTemplate from "@/app/templates/FrontPageTemplate";
import AuthProvider from "@/components/auth/AuthProvider";
type Params = Promise<{ locale: "fi" | "en" }>;

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;

  const payload = await getPayload({
    config: configPromise,
  });

  const { docs: articles } = await payload.find({
    collection: "articles",
    sort: "-publishedDate",
    locale: locale,
  });

  return (
    <AuthProvider>
      <FrontPageTemplate />
      {articles.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </AuthProvider>
  );
}
