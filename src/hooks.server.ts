import { SvelteKitAuth } from '@auth/sveltekit';
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Provider } from "@auth/core/providers"
import prisma from "$lib/prisma";
import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  // AUTH_SECRET,
  AUTH_TRUST_HOST,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  AZURE_AD_CLIENT_ID,
  AZURE_AD_CLIENT_SECRET,
  AZURE_AD_TENANT_ID,
  KEYCLOAK_NAME,
  KEYCLOAK_ID,
  KEYCLOAK_SECRET,
  KEYCLOAK_ISSUER,
  KEYCLOAK_DANGER_EMAIL_ACC_LINK,
  AUTHENTIK_NAME,
  AUTHENTIK_ID,
  AUTHENTIK_SECRET,
  AUTHENTIK_ISSUER,
} from '$env/static/private';

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
  providers.push(AzureAD.default({
    clientId: AZURE_AD_CLIENT_ID,
    clientSecret: AZURE_AD_CLIENT_SECRET,
    tenantId: AZURE_AD_TENANT_ID
  }))
}

if (AUTHENTIK_ID && AUTHENTIK_SECRET) {
  const Authentik = await import("@auth/sveltekit/providers/authentik")
  providers.push(Authentik.default({
    name: AUTHENTIK_NAME,
    clientId: AUTHENTIK_ID,
    clientSecret: AUTHENTIK_SECRET,
    issuer: AUTHENTIK_ISSUER,
  }))
}

if (KEYCLOAK_ID && KEYCLOAK_SECRET) {
  const Keycloak = await import("@auth/sveltekit/providers/keycloak")
  providers.push(Keycloak.default({
    clientId: KEYCLOAK_ID,
    name: KEYCLOAK_NAME,
    clientSecret: KEYCLOAK_SECRET,
    issuer: KEYCLOAK_ISSUER,
    allowDangerousEmailAccountLinking: Boolean(KEYCLOAK_DANGER_EMAIL_ACC_LINK),
  }))
}

if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
  const Email = await import("@auth/sveltekit/providers/email")
  providers.push(Email.default({
    server: {
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      },
      from: SMTP_FROM
    }
  }))
}

const handleGlobal: Handle = async ({ event, resolve }) => {
  // @ts-expect-error
  event.locals.providers = providers.map(provider => ({ id: provider.id as string, name: provider.name }))
  const response = await resolve(event);
  return response;
};

export const handleAuth = SvelteKitAuth({
  providers,
  callbacks: {
    // @ts-expect-error
    session: async ({ session, token }) => {
      if (token) {
        session.user.userId = token.sub
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  // secret: AUTH_SECRET,
  trustHost: AUTH_TRUST_HOST,
  pages: {
    signIn: '/login',
  }
})

export const handle = sequence(handleAuth, handleGlobal)
