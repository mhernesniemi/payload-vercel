import Container from "@/components/Container";
import Header from "@/components/Header";
import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

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

  return (
    <Container>
      <Header />
      <div className="mx-auto max-w-screen-lg py-16">
        <LogoutButton />
        <h1>Create Article</h1>
        <p>This is a placeholder page for creating an article.</p>
        <div className="mt-4">
          <p>Logged in user: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      </div>
    </Container>
  );
}
