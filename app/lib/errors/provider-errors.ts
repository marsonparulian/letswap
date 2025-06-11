/**
 * Provider-specific Error Handling
 *
 * USE CASES:
 * - Handling Google OAuth specific errors (token revoked, scope changes)
 * - Managing Facebook Login specific failures (permissions denied, app deactivation)
 * - Converting provider-specific error messages to user-friendly format
 * - Generating appropriate recovery actions based on provider error type
 * - Supporting future provider integrations with extensible error mapping
 */

import { AUTH_ERROR_CODES, createAuthError, AuthError } from "./auth-errors";

/**
 * Provider-specific error codes
 */
export const PROVIDER_ERROR_CODES = {
  GOOGLE: {
    TOKEN_REVOKED: "google.token_revoked",
    INVALID_GRANT: "google.invalid_grant",
    ACCESS_DENIED: "google.access_denied",
    SCOPE_CHANGED: "google.scope_changed",
    RATE_LIMITED: "google.rate_limited",
  },
  FACEBOOK: {
    USER_CANCELLED: "facebook.user_cancelled",
    PERMISSIONS_DENIED: "facebook.permissions_denied",
    APP_NOT_AUTHORIZED: "facebook.app_not_authorized",
    APP_DEACTIVATED: "facebook.app_deactivated",
  },
  COMMON: {
    POPUP_CLOSED: "provider.popup_closed",
    POPUP_BLOCKED: "provider.popup_blocked",
    TIMEOUT: "provider.timeout",
  },
};

/**
 * Handles Google OAuth specific errors
 *
 * @param errorCode - Google error code
 * @param errorMessage - Original error message
 * @returns AuthError with Google-specific details
 */
export function handleGoogleError(
  errorCode: string,
  errorMessage: string
): AuthError {
  const googleErrorMap: Record<string, string> = {
    invalid_grant:
      "Your Google authorization has expired or was revoked. Please sign in again.",
    access_denied:
      "You denied access to your Google account. Please allow required permissions to continue.",
    popup_closed_by_user:
      "You closed the Google sign-in window. Please try again.",
    idpiframe_initialization_failed:
      "There was a problem initializing Google sign-in. Please try a different method.",
    immediate_failed:
      "Google automatic sign-in failed. Please try manual sign-in.",
  };

  // Determine appropriate error code
  let code = AUTH_ERROR_CODES.PROVIDER_ERROR;
  if (errorCode === "invalid_grant") {
    code = PROVIDER_ERROR_CODES.GOOGLE.INVALID_GRANT;
  } else if (errorCode === "access_denied") {
    code = PROVIDER_ERROR_CODES.GOOGLE.ACCESS_DENIED;
  }

  // Get appropriate message or use a generic one
  const message =
    googleErrorMap[errorCode] ||
    `Google authentication error: ${errorMessage || "Unknown error"}`;

  return createAuthError(code, message, "google");
}

/**
 * Handles Facebook Login specific errors
 *
 * @param errorCode - Facebook error code
 * @param errorMessage - Original error message
 * @returns AuthError with Facebook-specific details
 */
export function handleFacebookError(
  errorCode: string,
  errorMessage: string
): AuthError {
  const facebookErrorMap: Record<string, string> = {
    user_cancelled:
      "You cancelled the Facebook login process. Please try again.",
    access_denied:
      "You denied access to your Facebook account. Please allow required permissions to continue.",
    auth_cancelled: "Facebook authentication was cancelled. Please try again.",
    permission_denied:
      "Required Facebook permissions were not granted. Please allow all required permissions.",
    not_authorized:
      "The app is not authorized to use Facebook Login. Please contact support.",
    service_disabled:
      "Facebook Login service is currently unavailable. Please try again later.",
  };

  // Determine appropriate error code
  let code = AUTH_ERROR_CODES.PROVIDER_ERROR;
  if (errorCode === "user_cancelled") {
    code = PROVIDER_ERROR_CODES.FACEBOOK.USER_CANCELLED;
  } else if (errorCode.includes("permission")) {
    code = PROVIDER_ERROR_CODES.FACEBOOK.PERMISSIONS_DENIED;
  } else if (errorCode === "not_authorized") {
    code = PROVIDER_ERROR_CODES.FACEBOOK.APP_NOT_AUTHORIZED;
  }

  // Get appropriate message or use a generic one
  const message =
    facebookErrorMap[errorCode] ||
    `Facebook authentication error: ${errorMessage || "Unknown error"}`;

  return createAuthError(code, message, "facebook");
}

/**
 * Handles common provider errors that aren't specific to a single provider
 *
 * @param errorCode - Common error code
 * @param provider - Provider name (optional)
 * @returns AuthError with appropriate details
 */
export function handleCommonProviderError(
  errorCode: string,
  provider?: string
): AuthError {
  const commonErrorMap: Record<string, string> = {
    popup_closed:
      "The authentication window was closed before completion. Please try again.",
    popup_blocked:
      "The sign-in popup was blocked by your browser. Please allow popups for this site.",
    timeout:
      "The authentication request timed out. Please check your connection and try again.",
  };

  // Determine appropriate error code
  let code = AUTH_ERROR_CODES.PROVIDER_ERROR;
  if (errorCode === "popup_closed") {
    code = PROVIDER_ERROR_CODES.COMMON.POPUP_CLOSED;
  } else if (errorCode === "popup_blocked") {
    code = PROVIDER_ERROR_CODES.COMMON.POPUP_BLOCKED;
  } else if (errorCode === "timeout") {
    code = PROVIDER_ERROR_CODES.COMMON.TIMEOUT;
  }

  return createAuthError(
    code,
    commonErrorMap[errorCode] || "An unknown error occurred",
    provider
  );
}
