import prisma from "$lib/prisma"
import { env } from "$env/dynamic/private"
import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Provider } from "@auth/sveltekit/providers"

const providers: Provider[] = []

if (env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET) {
  const GitHub = await import("@auth/sveltekit/providers/github")
  providers.push(
    GitHub.default({
      allowDangerousEmailAccountLinking: true,
    }),
  )
}

if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
  const Google = await import("@auth/sveltekit/providers/google")
  providers.push(Google.default({}))
}

if (env.AUTH_AZURE_AD_CLIENT_ID && env.AUTH_AZURE_AD_CLIENT_SECRET) {
  const AzureAD = await import("@auth/sveltekit/providers/azure-ad")
  providers.push(AzureAD.default({}))
}

if (env.AUTH_AUTHENTIK_ID && env.AUTH_AUTHENTIK_SECRET) {
  const Authentik = await import("@auth/sveltekit/providers/authentik")
  providers.push(Authentik.default({}))
}

if (env.AUTH_KEYCLOAK_ID && env.AUTH_KEYCLOAK_SECRET) {
  const Keycloak = await import("@auth/sveltekit/providers/keycloak")
  providers.push(Keycloak.default({}))
}

if (env.AUTH_SMTP_HOST && env.AUTH_SMTP_USER && env.AUTH_SMTP_PASSWORD) {
  const Email = await import("@auth/sveltekit/providers/nodemailer")
  providers.push(
    Email.default({
      server: {
        host: env.AUTH_SMTP_HOST,
        port: Number(env.AUTH_SMTP_PORT),
        auth: {
          user: env.AUTH_SMTP_USER,
          pass: env.AUTH_SMTP_PASSWORD,
        },
        from: env.AUTH_SMTP_FROM,
      },
    }),
  )
}

export const providerMap = providers.map((provider) => {
  // @ts-expect-error wtf
  return { id: provider.id, name: provider.name }
})

export const { signIn, signOut, handle } = SvelteKitAuth({
  debug: false,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userSettings = user.settings ?? {}
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token?.sub && session.user) {
        session.user.id = token.sub
      }
      session.user.settings = token.userSettings as Record<string, unknown>
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})
