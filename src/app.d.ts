// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    getSession: () => Promise<Session>
    providers: {
      id: string
      name: string
    }[]
  }
  // interface Platform {}
  // interface PrivateEnv {}
  // interface PublicEnv {}
}

declare module "@auth/core/types" {  // I'm using PNPM but this seems to be working fine
  interface Session {
    user: {
      userId?: string;
    } & DefaultSession['user'];
  }
}
