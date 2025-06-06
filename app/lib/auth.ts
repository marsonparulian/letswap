import type { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
      isProfileComplete?: boolean;
      slug?: string;
      provider?: string; // Make provider available in session
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    name?: string;
    isAdmin?: boolean;
    isProfileComplete?: boolean;
    slug?: string;
    provider?: string; // Store which provider was used
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID ?? "",
      clientSecret: process.env.FACEBOOK_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log(`JWT Callback Triggered by: ${trigger}`);

      if (user && account) {
        // Scenario 1: First sign in with provider
        console.log(`Initial sign-in with ${account.provider} provider`);

        // First, try to find existing user account by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || "" },
          select: {
            id: true,
            isProfileComplete: true,
            slug: true,
          },
        });

        if (existingUser) {
          // User exists, check if this provider account is linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            // Link this provider to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              },
            });
          }

          token.id = existingUser.id;
          token.isProfileComplete = existingUser.isProfileComplete;
          token.slug = existingUser.slug || "";
        } else {
          // New user, create account
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              // Store provider info in Account model
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                },
              },
            },
            select: {
              id: true,
            },
          });
          token.id = newUser.id;
          token.isProfileComplete = false;
          token.slug = undefined;
        }

        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.isAdmin = false; // Default value, update based on your admin logic
        token.provider = account.provider; // Store which provider was used
      } else if (trigger === "update") {
        // Scenario 2: Token refresh (happens every updateAge interval)
        console.log("Token refresh");
        // Optionally refresh user data from database
        if (token.id) {
          const profile = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              isProfileComplete: true,
              slug: true,
            },
          });
          // Update token with fresh data
          token.isProfileComplete = profile?.isProfileComplete ?? false;
          token.slug = profile?.slug ?? undefined;
        }
      }
      // Scenario 3: Regular token decode (happens on every authenticated request)
      // We don't need to do anything here, just return the token

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isProfileComplete = token.isProfileComplete;
        session.user.slug = token.slug;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
