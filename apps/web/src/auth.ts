import { PrismaAdapter } from "@auth/prisma-adapter"
import { type JWT, SvelteKitAuth, type User } from "@auth/sveltekit"
import type { Provider } from "@auth/sveltekit/providers"
import { env } from "$env/dynamic/private"
import { db } from "$lib/prisma"

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
  providers.push(
    Google.default({
      allowDangerousEmailAccountLinking: true,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  )
}

if (env.AUTH_MICROSOFT_ENTRA_ID_ID && env.AUTH_MICROSOFT_ENTRA_ID_SECRET) {
  const Entra = await import("@auth/sveltekit/providers/microsoft-entra-id")
  providers.push(
    Entra.default({
      allowDangerousEmailAccountLinking: true,
    }),
  )
}

if (env.AUTH_AUTHENTIK_ID && env.AUTH_AUTHENTIK_SECRET) {
  const Authentik = await import("@auth/sveltekit/providers/authentik")
  providers.push(
    Authentik.default({
      allowDangerousEmailAccountLinking: true,
    }),
  )
}

if (env.AUTH_KEYCLOAK_ID && env.AUTH_KEYCLOAK_SECRET) {
  const Keycloak = await import("@auth/sveltekit/providers/keycloak")
  providers.push(
    Keycloak.default({
      allowDangerousEmailAccountLinking: true,
    }),
  )
}

if (env.AUTH_SENDGRID_KEY) {
  const Sendgrid = await import("@auth/sveltekit/providers/sendgrid")
  providers.push(
    Sendgrid.default({
      from: "no-reply@briefkastenhq.com",
    }),
  )
}

export const providerMap = providers.map((provider) => {
  // @ts-expect-error id exists
  return { id: provider.id as string, name: provider.name }
})

export const { signIn, signOut, handle } = SvelteKitAuth({
  debug: true,
  trustHost: true,
  adapter: PrismaAdapter(db),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, profile, account, user, trigger }) {
      if (account) {
        // Initial user profile
        const userProfile: User = {
          id: token.sub,
          name: profile?.name,
          email: profile?.email,
          image: token?.picture,
        }

        // If signing in, add DB 'settings' to profile
        if (trigger === "signIn" && user) {
          userProfile.settings = user.settings
        }

        return {
          ...token,
          access_token: account.access_token,
          expires_at: Math.floor(Date.now() / 1000 + (account.expires_in ?? 60 * 60 * 24 * 30)),
          refresh_token: account.refresh_token,
          providerId: account.provider,
          profile: userProfile,
        }
      } else if (Date.now() < (token.expires_at as number) * 1000) {
        // Token is still valid
        return token
      } else {
        // Token expired
        // @ts-expect-error unsure about this one atm
        return await refreshAccessToken(token)
      }
    },
    async session({ session, token }) {
      if (token.profile) {
        // @ts-expect-error skipping 'emailVerified' on purpose
        session.user = token.profile as User
      }

      session.error = token.error as "RefreshAccessTokenError" | undefined
      // session.accessToken = token.access_token
      return session
    },
  },
})

async function refreshAccessToken(token: JWT) {
  let url = ""
  let clientId = ""
  let clientSecret = ""

  if (token.providerId === "github") {
    url = "https://github.com/login/oauth/access_token"
    clientId = process.env.AUTH_GITHUB_ID!
    clientSecret = process.env.AUTH_GITHUB_SECRET!
  } else if (token.providerId === "google") {
    url = "https://oauth2.googleapis.com/token"
    clientId = process.env.AUTH_GOOGLE_ID!
    clientSecret = process.env.AUTH_GOOGLE_SECRET!
  }

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token!,
      }),
      method: "POST",
    })

    const tokens = (await response.json()) as Record<string, unknown>

    if (!response.ok) {
      throw new Error(JSON.stringify(tokens))
    }

    return {
      ...token,
      access_token: tokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
      refresh_token: tokens.refresh_token ?? token.refresh_token,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
