import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "@auth/sveltekit/providers/github"
import prisma from "$lib/prisma";
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
  ],
  callbacks: {
    async session(session) {
      if (session.session.user) {
        session.session.user.userId = session.user.id
      }
      return session.session
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: AUTH_SECRET,
  pages: {
    signIn: '/login',
  }
})
