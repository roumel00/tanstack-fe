import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/auth` 
    : 'http://localhost:3113/api/auth',
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Export inferred types from better-auth
// These types match the structure returned by better-auth
// Note: firstName/lastName/lastAccessedOrg are additional fields stored in Better Auth session
export type User = typeof authClient.$Infer.Session.user & {
  firstName?: string;
  lastName?: string;
  lastAccessedOrg?: string;
};

export type SessionData = typeof authClient.$Infer.Session;
