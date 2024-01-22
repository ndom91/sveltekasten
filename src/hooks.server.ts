import { sequence } from "@sveltejs/kit/hooks"
import { SvelteKitAuth } from "@auth/sveltekit"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import type { Handle } from "@sveltejs/kit"
import type { Provider } from "@auth/sveltekit/providers"
import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"
import { db } from "$lib/db"

const providers: Provider[] = []

if (env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET) {
  const GitHub = await import("@auth/sveltekit/providers/github")
  providers.push(GitHub.default({}))
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
  const Email = await import("@auth/sveltekit/providers/email")
  providers.push(
    Email.default({
      server: {
        host: env.AUTH_SMTP_HOST,
        port: env.AUTH_SMTP_PORT,
        auth: {
          user: env.AUTH_SMTP_USER,
          pass: env.AUTH_SMTP_PASSWORD,
        },
        from: env.AUTH_SMTP_FROM,
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
  adapter: DrizzleAdapter(db),
  secret: env.AUTH_SECRET,
  trustHost: Boolean(env.AUTH_TRUST_HOST ?? false),
  pages: {
    signIn: "/login",
  },
})

export const handle = sequence(logger, handleAuth, handleGlobal)
