/**
 * Authentication Error Hooks
 *
 * USE CASES:
 * - Providing React components with auth error handling capabilities
 * - Enabling consistent error UI across authentication flows
 * - Managing error state and recovery options in React components
 * - Integrating with NextAuth for error handling
 * - Supporting retry mechanisms in React authentication flows
 */

"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { AuthError } from "./auth-errors";
import { executeWithErrorHandling } from "./error-handler";

/**
 * Type definition for NextAuth sign-in options
 * Based on common NextAuth parameters
 */
interface SignInOptions {
  callbackUrl?: string;
  redirect?: boolean;
  email?: string;
  password?: string;
  // Use unknown instead of any for better type safety
  [key: string]: unknown;
}

/**
 * Custom React hook for handling authentication operations with error handling
 */
export function useAuthErrorHandler() {
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Executes a sign-in operation with error handling
   *
   * @param provider - Authentication provider to use (e.g., 'google', 'facebook')
   * @param options - Additional sign-in options
   * @returns Success status of the operation
   */
  const handleSignIn = useCallback(
    async (provider: string, options: SignInOptions = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await executeWithErrorHandling(
          () => signIn(provider, options),
          { provider, shouldRetry: true }
        );

        setIsLoading(false);
        return result;
      } catch (err) {
        const authError = err as AuthError;
        setError(authError);
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Retries the last failed operation
   *
   * @param provider - Authentication provider to use
   * @param options - Additional sign-in options
   */
  const retryAuth = useCallback(
    (provider: string, options: SignInOptions = {}) => {
      handleSignIn(provider, options);
    },
    [handleSignIn]
  );

  return {
    error,
    isLoading,
    handleSignIn,
    clearError,
    retryAuth,
  };
}
