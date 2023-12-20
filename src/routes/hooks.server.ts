import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "@auth/core/providers/github"
import prisma from "$lib/prisma";
import { GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
  ],
  callbacks: {
    async session(session, user) {
      session.user.userId = user.id
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: AUTH_SECRET,
  debug: true,
  // pages: {
  //   signIn: '/login',
  //   signOut: '/logout'
  // }
})
