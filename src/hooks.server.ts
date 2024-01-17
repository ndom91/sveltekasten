import { sequence } from "@sveltejs/kit/hooks"
import { SvelteKitAuth } from "@auth/sveltekit"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Handle } from "@sveltejs/kit"
import type { Provider } from "@auth/sveltekit/providers"
import prisma from "$lib/prisma"
import { dev } from "$app/environment"

import {
  AUTH_SECRET,
  AUTH_TRUST_HOST,
  AUTHENTIK_ID,
  AUTHENTIK_ISSUER,
  AUTHENTIK_NAME,
  AUTHENTIK_SECRET,
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID,
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  KEYCLOAK_DANGER_EMAIL_ACC_LINK,
  KEYCLOAK_ID,
  KEYCLOAK_ISSUER,
  KEYCLOAK_NAME,
  KEYCLOAK_SECRET,
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "$env/static/private"

const providers: Provider[] = []

if (GITHUB_ID && GITHUB_SECRET) {
  const GitHub = await import("@auth/sveltekit/providers/github")
  providers.push(GitHub.default({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }))
}

if (GOOGLE_ID && GOOGLE_SECRET) {
  const Google = await import("@auth/sveltekit/providers/google")
  providers.push(Google.default({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }))
}

if (AZURE_AD_CLIENT_ID && AZURE_AD_CLIENT_SECRET) {
  const AzureAD = await import("@auth/sveltekit/providers/azure-ad")
  providers.push(
    AzureAD.default({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
    }),
  )
}

if (AUTHENTIK_ID && AUTHENTIK_SECRET) {
  const Authentik = await import("@auth/sveltekit/providers/authentik")
  providers.push(
    Authentik.default({
      name: AUTHENTIK_NAME,
      clientId: AUTHENTIK_ID,
      clientSecret: AUTHENTIK_SECRET,
      issuer: AUTHENTIK_ISSUER,
    }),
  )
}

if (KEYCLOAK_ID && KEYCLOAK_SECRET) {
  const Keycloak = await import("@auth/sveltekit/providers/keycloak")
  providers.push(
    Keycloak.default({
      clientId: KEYCLOAK_ID,
      name: KEYCLOAK_NAME,
      clientSecret: KEYCLOAK_SECRET,
      issuer: KEYCLOAK_ISSUER,
      allowDangerousEmailAccountLinking: Boolean(KEYCLOAK_DANGER_EMAIL_ACC_LINK),
    }),
  )
}

if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
  const Email = await import("@auth/sveltekit/providers/email")
  providers.push(
    Email.default({
      server: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
        from: SMTP_FROM,
      },
    }),
  )
}

const logger: Handle = async ({ event, resolve }) => {
  if (!dev) {
    return resolve(event)
  }
  const start_time = Date.now()
  // Wait on response, run other hooks and load
  const response = await resolve(event)

  console.log(`${Date.now() - start_time}ms  ${event.request.method} ${event.url.pathname}`)

  return response
}

const handleGlobal: Handle = async ({ event, resolve }) => {
  // @ts-expect-error
  event.locals.providers = providers.map((provider) => ({
    // @ts-expect-error
    id: provider.id as string,
    name: provider.name,
  }))
  const response = await resolve(event)
  return response
}

export const handleAuth = SvelteKitAuth({
  providers,
  callbacks: {
    // @ts-expect-error
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.userId = token.sub
      }
      return session
    },
    jwt: async ({ token }) => {
      token.idToken = ""
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  // @ts-expect-error
  adapter: PrismaAdapter(prisma),
  secret: AUTH_SECRET,
  trustHost: Boolean(AUTH_TRUST_HOST ?? false),
  pages: {
    signIn: "/login",
  },
})

export const handle = sequence(logger, handleAuth, handleGlobal)
