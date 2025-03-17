import Container from "@/components/Container";
import Header from "@/components/Header";
import ErrorTemplate from "@/components/templates/ErrorTemplate";
import FrontPageTemplate from "@/components/templates/FrontPageTemplate";
import { SITE_NAME } from "@/lib/constants";
import { prepareOpenGraphImages } from "@/lib/utils";
import configPromise from "@payload-config";
// import * as Sentry from "@sentry/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

export const dynamic = "force-dynamic";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

async function getFrontPage() {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const frontPage = await payload.findGlobal({
      slug: "front-page",
      locale: "fi",
    });

    return { frontPage: frontPage, error: null };
  } catch (error) {
    console.error("Error fetching page:", error);
    // Sentry.captureException(error);
    return { frontPage: null, error: error as Error };
  }
}

export default async function FrontPage() {
  const { frontPage, error } = await getFrontPage();

  if (error) {
    return <ErrorTemplate error={error} />;
  }
  if (!frontPage) {
    notFound();
  }

  return (
    <Container>
      <Header />
      <FrontPageTemplate content={frontPage} />
    </Container>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { frontPage } = await getFrontPage();
    const openGraphImages = prepareOpenGraphImages(frontPage?.meta?.image);

    return {
      title: frontPage?.meta?.title || SITE_NAME,
      description: frontPage?.meta?.description,
      openGraph: openGraphImages ? { images: openGraphImages } : undefined,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Sentry.captureException(error);
    return {
      title: SITE_NAME,
    };
  }
}
