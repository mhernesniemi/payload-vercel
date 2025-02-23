"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function FrontPageTemplate() {
  const { data: session, status } = useSession();

  console.log("client session", session);

  return (
    <div className="mx-auto max-w-screen-md py-16">
      {status === "authenticated" && session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      {status === "unauthenticated" && (
        <>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {status === "loading" && <div>Loading...</div>}
    </div>
  );
}
