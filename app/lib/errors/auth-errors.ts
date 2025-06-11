/**
 * Authentication Error System
 *
 * USE CASES:
 * - Standardizing error format across auth providers (Google, Facebook)
 * - Converting NextAuth error strings to application error objects
 * - Displaying user-friendly error messages in the auth UI
 * - Facilitating error logging and monitoring
 * - Supporting internationalization of error messages
 */
export type AuthError = {
  code: string; // Unique error code for identification
  message: string; // User-friendly error message
  provider?: string; // Optional provider source of error (e.g., 'google', 'facebook')
};

/**
 * Common Auth Error Codes
 *
 * Predefined error codes to ensure consistency in error reporting
 * and simplify error handling throughout the application.
 */
export const AUTH_ERROR_CODES = {
  CONFIGURATION: "auth.configuration",
  ACCESS_DENIED: "auth.access_denied",
  VERIFICATION_FAILED: "auth.verification_failed",
  SESSION_EXPIRED: "auth.session_expired",
  PROVIDER_ERROR: "auth.provider_error",
  NETWORK_ERROR: "auth.network_error",
  UNKNOWN: "auth.unknown",
};

/**
 * Creates a standardized authentication error object
 *
 * @param code - Error code from AUTH_ERROR_CODES
 * @param message - User-friendly error message
 * @param provider - Optional provider name
 * @returns AuthError object with standardized format
 */
export function createAuthError(
  code: string,
  message: string,
  provider?: string
): AuthError {
  return {
    code,
    message,
    ...(provider ? { provider } : {}),
  };
}

/**
 * Maps Next Auth error strings to our custom error structure
 *
 * @param errorString - Error string from NextAuth
 * @param provider - Optional provider name
 * @returns Standardized AuthError object
 */
export function mapNextAuthError(
  errorString: string,
  provider?: string
): AuthError {
  const errorMap: Record<string, { code: string; message: string }> = {
    Configuration: {
      code: AUTH_ERROR_CODES.CONFIGURATION,
      message: "There is a problem with the server configuration.",
    },
    AccessDenied: {
      code: AUTH_ERROR_CODES.ACCESS_DENIED,
      message: "You do not have permission to sign in.",
    },
    Verification: {
      code: AUTH_ERROR_CODES.VERIFICATION_FAILED,
      message: "The verification link was invalid or has expired.",
    },
    OAuthSignin: {
      code: AUTH_ERROR_CODES.PROVIDER_ERROR,
      message: "Error starting OAuth sign in.",
    },
    OAuthCallback: {
      code: AUTH_ERROR_CODES.PROVIDER_ERROR,
      message: "Error completing OAuth sign in.",
    },
    OAuthCreateAccount: {
      code: AUTH_ERROR_CODES.PROVIDER_ERROR,
      message: "Error creating OAuth account.",
    },
    SessionRequired: {
      code: AUTH_ERROR_CODES.SESSION_EXPIRED,
      message: "Your session has expired. Please sign in again.",
    },
  };

  const errorData = errorMap[errorString] || {
    code: AUTH_ERROR_CODES.UNKNOWN,
    message: "An unknown authentication error occurred.",
  };

  return createAuthError(errorData.code, errorData.message, provider);
}

/**
 * Handles network-related authentication errors
 *
 * @param error - The original error object
 * @returns AuthError with network error details
 */
export function handleNetworkError(error: Error): AuthError {
  return createAuthError(
    AUTH_ERROR_CODES.NETWORK_ERROR,
    "A network error occurred during authentication. Please check your connection and try again."
  );
}
