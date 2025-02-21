import Container from "@/components/Container";
import Header from "@/components/Header";
import SearchTemplate from "@/app/templates/SearchTemplate";

type Params = Promise<{ locale: "fi" | "en" }>;

export default async function SearchPage({ params }: { params: Params }) {
  const { locale } = await params;
  console.log("locale", locale);

  return (
    <Container>
      <Header />
      <SearchTemplate />
    </Container>
  );
}
