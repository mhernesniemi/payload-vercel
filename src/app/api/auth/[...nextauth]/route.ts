import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPayload } from "payload";
import config from "../../../../payload.config";
import { cookies } from "next/headers";

const initializePayload = async () => {
  try {
    return await getPayload({ config });
  } catch (error) {
    console.error("Error initializing Payload:", error);
    throw error;
  }
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const payload = await initializePayload();
          const { user } = await payload.login({
            collection: "users",
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (_error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      console.log("password", process.env.SSO_SHARED_PASSWORD);
      if (account?.provider === "google") {
        try {
          if (!user.email) {
            console.error("No email provided by Google");
            return false;
          }

          const payload = await initializePayload();

          // Check if user already exists
          const existingUser = await payload.find({
            collection: "users",
            where: {
              email: { equals: user.email },
            },
          });

          if (existingUser.totalDocs === 0) {
            // Create a new user with Google details
            await payload.create({
              collection: "users",
              data: {
                email: user.email,
                googleId: user.id,
                role: "user",
                password: process.env.SSO_SHARED_PASSWORD,
              },
            });
          }

          const result = await payload.login({
            collection: "users",
            data: {
              email: user.email,
              password: process.env.SSO_SHARED_PASSWORD || "",
            },
          });

          if (result.token) {
            (await cookies()).set("payload-token", result.token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          }

          return true;
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          if (error instanceof Error) {
            console.error("Error details:", {
              message: error.message,
              stack: error.stack,
              name: error.name,
            });
          }
          return false;
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
