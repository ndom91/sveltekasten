import "@auth/sveltekit";

declare module "@auth/sveltekit/jwt" {
  interface JWT {
    idToken?: string;
  }
}

type Provider = {
  id: string;
  name: string;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    providers: Provider[]
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

interface ViewTransition {
  updateCallbackDone: Promise<void>;
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
}

interface Document {
  startViewTransition(updateCallback: () => Promise<void>): ViewTransition;
}

