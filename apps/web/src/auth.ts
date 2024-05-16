import { db } from "$lib/prisma"
import { env } from "$env/dynamic/private"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { SvelteKitAuth, type User } from "@auth/sveltekit"
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
  providers.push(
    Google.default({
      allowDangerousEmailAccountLinking: true,
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
  return { id: provider.id, name: provider.name }
})

export const { signIn, signOut, handle } = SvelteKitAuth({
  debug: false,
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
    async jwt({ token, profile, account, user, trigger, ...rest }) {
      console.log("authjs.callback.jwt", { token, profile, account, rest })
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
      } else if (Date.now() < token.expires_at * 1000) {
        // Token is still valid
        return token
      } else {
        // Token expired
        return await refreshAccessToken(token)
      }
    },
    async session({ session, token }) {
      console.log("authjs.callback.session", { session, token })
      if (token.profile) {
        session.user = token.profile
      }

      session.error = token.error ?? undefined
      // session.accessToken = token.access_token
      return session
    },
  },
})

async function refreshAccessToken(token: Record<string, string>) {
  let url = ""
  if (token.providerId === "github") {
    url = "https://github.com/login/oauth/access_token"
  } else if (token.provider === "google") {
    url = "https://oauth2.googleapis.com/token"
  }

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GITHUB_ID!,
        client_secret: process.env.AUTH_GITHUB_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token!,
      }),
      method: "POST",
    })

    const tokens = await response.json()

    if (!response.ok) throw tokens

    return {
      ...token,
      access_token: tokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refresh_token: tokens.refresh_token ?? token.refresh_token,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
