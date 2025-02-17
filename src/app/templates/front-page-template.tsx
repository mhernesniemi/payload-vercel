"use client";

import { InstantSearch, SearchBox, Hits } from "react-instantsearch-dom";
import createClient from "@searchkit/instantsearch-client";
import { Link } from "@/i18n/routing";
import { useSession, signIn, signOut } from "next-auth/react";

const searchClient = createClient({
  url: "/api/search",
});

interface Hit {
  title: string;
  slug: string;
}

function Hit({ hit }: { hit: Hit }) {
  return (
    <Link href={`/articles/${hit.slug}`}>
      <div className="mb-4 rounded-lg border p-4">
        <h2 className="text-xl font-bold">{hit.title}</h2>
        <div className="mt-4 text-sm text-gray-500">Slug: {hit.slug} </div>
      </div>
    </Link>
  );
}

export default function FrontPageTemplate() {
  const { data: session, status } = useSession();
  console.log("data", session);
  console.log("status", status);

  return (
    <div className="mx-auto max-w-screen-md py-16">
      <InstantSearch searchClient={searchClient} indexName="articles">
        <div className="flex flex-col gap-10">
          <SearchBox />
          <Hits hitComponent={Hit} />
        </div>
      </InstantSearch>
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      {!session && (
        <>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </div>
  );
}
