import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error(
    "Please define the GITHUB_ID and GITHUB_SECRET environment variables inside .env.local"
  );
}
if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error(
    "Please define the GITHUB_ID and GITHUB_SECRET environment variables inside .env.local"
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token }) {

      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.picture = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-up",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const { auth, signIn, signOut, update } = handler;
