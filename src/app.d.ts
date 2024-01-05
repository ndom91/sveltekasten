import "@auth/sveltekit";

declare module "@auth/sveltekit/jwt" {
  interface JWT {
    idToken?: string;
  }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    providers: {
      id: string;
      name: string;
    }[];
  }
  // interface Platform {}
  // interface PrivateEnv {}
  // interface PublicEnv {}
}

// Requires @auth/sveltekit@0.5.1+
declare module "@auth/sveltekit" {
  interface User {
    userId: string;
  }
}
