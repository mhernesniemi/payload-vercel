import configPromise from "@payload-config";
import { getPayload } from "payload";
import FrontPageTemplate from "@/app/templates/FrontPageTemplate";
import Container from "@/components/Container";
import Header from "@/components/Header";

type Params = Promise<{ locale: "fi" | "en" }>;

export default async function Home({ params }: { params: Params }) {
  const { locale } = await params;

  const payload = await getPayload({
    config: configPromise,
  });

  const frontPage = await payload.findGlobal({
    slug: "front-page",
    locale: locale,
  });

  return (
    <Container>
      <Header />
      <FrontPageTemplate content={frontPage} />
    </Container>
  );
}
