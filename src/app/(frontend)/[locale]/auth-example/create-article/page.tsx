import Container from "@/components/Container";
import Header from "@/components/Header";
import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function CreateArticlePage() {
  const payload = await getPayload({
    config: configPromise,
  });

  const session = await payload.auth({
    headers: await headers(),
  });

  console.log("Payload auth:", session);

  return (
    <Container>
      <Header />
      <div className="mx-auto max-w-screen-lg py-16">
        <h1>Luo Artikkeli</h1>
        <p>Tämä on paikkamerkkisivu artikkelin luomista varten.</p>
        <div className="mt-4">
          <p>Kirjautunut käyttäjä: {session?.user?.email}</p>
          <p>Rooli: {session?.user?.role}</p>
        </div>
      </div>
    </Container>
  );
}
