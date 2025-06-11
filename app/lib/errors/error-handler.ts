/**
 * Authentication Error Handler
 *
 * USE CASES:
 * - Centralizing error handling across all authentication flows
 * - Implementing provider authentication failure recovery strategies
 * - Managing network connectivity issues during authentication
 * - Handling session expiration scenarios with appropriate responses
 * - Applying retry mechanisms with exponential backoff
 */

import {
  AuthError,
  AUTH_ERROR_CODES,
  handleNetworkError,
  mapNextAuthError,
} from "./auth-errors";
import {
  // handleSessionExpired,
  // isSessionError,
  SESSION_ERROR_CODES,
} from "./session-errors";
import {
  handleFacebookError,
  handleGoogleError,
  handleCommonProviderError,
} from "./provider-errors";
import { retryWithBackoff } from "./retry-utils";

/**
 * Type definition for authentication operation
 */
type AuthOperation<T> = () => Promise<T>;

/**
 * Type definition for error handling options
 */
interface ErrorHandlingOptions {
  provider?: string;
  maxRetries?: number;
  shouldRetry?: boolean;
  retryableErrors?: string[];
}

// Default options
const DEFAULT_ERROR_OPTIONS: ErrorHandlingOptions = {
  shouldRetry: true,
  maxRetries: 3,
  retryableErrors: [
    AUTH_ERROR_CODES.NETWORK_ERROR,
    "timeout",
    "rate_limit",
    "server_error",
  ],
};

/**
 * Processes a provider-specific authentication error
 *
 * @param error - The original error
 * @param provider - Authentication provider name
 * @returns Standardized AuthError
 */
export function handleProviderError(
  error: Error,
  provider?: string
): AuthError {
  if (!error) {
    return mapNextAuthError("Default", provider);
  }

  const errorMessage = error.message || "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorCode = (error as any).code || "";

  // Handle provider-specific errors
  if (provider === "google") {
    return handleGoogleError(errorCode, errorMessage);
  } else if (provider === "facebook") {
    return handleFacebookError(errorCode, errorMessage);
  }

  // Check for network errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("connection") ||
    errorMessage.includes("offline") ||
    error instanceof TypeError
  ) {
    return handleNetworkError();
  }

  // Handle common provider errors
  if (errorMessage.includes("popup") || errorMessage.includes("window")) {
    if (errorMessage.includes("closed")) {
      return handleCommonProviderError("popup_closed", provider);
    } else if (errorMessage.includes("blocked")) {
      return handleCommonProviderError("popup_blocked", provider);
    }
  }

  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return handleCommonProviderError("timeout", provider);
  }

  // Default to unknown error with provider context
  return mapNextAuthError("Default", provider);
}

/**
 * Determines if an error should trigger a retry
 *
 * @param error - The error to check
 * @param retryableErrors - List of error codes that should be retried
 * @returns Boolean indicating if retry should be attempted
 */
export function isRetryableError(
  error: AuthError,
  retryableErrors: string[]
): boolean {
  // Network errors are always retryable
  if (error.code === AUTH_ERROR_CODES.NETWORK_ERROR) {
    return true;
  }

  // Session expired should not be retried (requires new login)
  if (error.code === SESSION_ERROR_CODES.EXPIRED) {
    return false;
  }

  // Check against list of retryable error codes
  return retryableErrors.some((code) => error.code.includes(code));
}

/**
 * Execute authentication operation with comprehensive error handling
 *
 * @param operation - Authentication operation to execute
 * @param options - Error handling configuration
 * @returns Result of the operation or throws AuthError
 */
export async function executeWithErrorHandling<T>(
  operation: AuthOperation<T>,
  options: ErrorHandlingOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_ERROR_OPTIONS, ...options };

  try {
    // If retries are enabled, use retry mechanism
    if (config.shouldRetry) {
      return await retryWithBackoff(operation, {
        maxRetries: config.maxRetries,
      });
    }

    // Otherwise just execute the operation
    return await operation();
  } catch (error) {
    const originalError =
      error instanceof Error ? error : new Error(String(error));

    // Convert to AuthError based on provider
    const authError = handleProviderError(originalError, config.provider);

    // Re-throw the standardized error
    throw authError;
  }
}
