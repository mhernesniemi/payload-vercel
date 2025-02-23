import Container from "@/components/Container";
import Header from "@/components/Header";
import { headers } from "next/headers";
import { getPayload, SanitizedCollectionPermission } from "payload";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import CreateArticle from "./create-article-temp";
import { fetchUserArticles } from "./actions";

export default async function CreateArticlePage() {
  const payload = await getPayload({
    config: configPromise,
  });

  const session = await payload.auth({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user) {
    redirect("/en/auth-example/login");
  }

  const permissions = session?.permissions.collections?.articles;

  const initialArticles = await fetchUserArticles(user.id);

  return (
    <Container>
      <Header />
      <CreateArticle
        user={user}
        permissions={permissions as SanitizedCollectionPermission}
        initialArticles={initialArticles}
      />
    </Container>
  );
}
