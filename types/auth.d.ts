import type { DefaultSession } from "@auth/core/types";

// declare module "@auth/core/types" {
// 	interface Session {
// 		user?: {
// 			userId?: string;
// 		} & DefaultSession["user"];
// 	}
// }

export declare module "@auth/core/types" {  // I'm using PNPM but this seems to be working fine
  interface Session {
    user: {
      userId?: string;
    } & DefaultSession['user'];
  }
}
