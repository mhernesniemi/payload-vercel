import configPromise from "@payload-config";
import { getPayload } from "payload";
import FrontPageTemplate from "@/app/templates/front-page-template";

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

  return <FrontPageTemplate />;
}
