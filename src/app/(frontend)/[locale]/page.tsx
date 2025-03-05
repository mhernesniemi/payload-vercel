import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

type Params = Promise<{ locale: "fi" | "en" }>;

export default async function Home({ params }: { params: Params }) {
  try {
    const { locale } = await params;
    const payload = await getPayload({ config: configPromise });

    if (!payload) {
      throw new Error("Could not establish a database connection");
    }

    const frontPage = await payload.findGlobal({
      slug: "front-page",
      locale: locale,
    });

    if (!frontPage) {
      return notFound();
    }

    return (
      <Container>
        <Header />
        <FrontPageTemplate content={frontPage} />
      </Container>
    );
  } catch (error) {
    console.error("Error loading the page:", error);
    return <ErrorTemplate error={error as Error} />;
  }
}
