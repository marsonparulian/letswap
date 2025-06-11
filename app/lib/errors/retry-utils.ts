/**
 * Authentication Retry Mechanism
 *
 * USE CASES:
 * - Automatic retries for network connectivity issues during authentication
 * - Handling temporary OAuth provider outages
 * - Recovering from transient API rate limits
 * - Implementing exponential backoff for failed auth attempts
 * - Converting various error types to standardized AuthError format
 */
import { AUTH_ERROR_CODES, createAuthError, AuthError } from "./auth-errors";

interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 10000, // 10 seconds
  backoffFactor: 2, // Double delay each retry
};

/**
 * Implements exponential backoff for retrying authentication operations
 *
 * @param operation - Async function to retry
 * @param config - Optional retry configuration
 * @returns Result of the operation or throws the last error
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | null = null;
  let delay = retryConfig.initialDelayMs;

  for (let attempt = 0; attempt < retryConfig.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If this is the last attempt, don't wait
      if (attempt === retryConfig.maxRetries - 1) {
        break;
      }

      // Wait with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Calculate next delay, with max limit
      delay = Math.min(
        delay * retryConfig.backoffFactor,
        retryConfig.maxDelayMs
      );
    }
  }

  // Convert to AuthError for consistent error handling
  throw convertToAuthError(lastError as Error);
}

/**
 * Converts a standard Error to our AuthError type
 *
 * @param error - Original error
 * @returns AuthError with appropriate code and message
 */
function convertToAuthError(error: Error): AuthError {
  // Check if it's a network related error
  if (
    error.message.includes("network") ||
    error.message.includes("connection") ||
    error.message.includes("offline") ||
    (error instanceof TypeError && error.message.includes("fetch"))
  ) {
    return createAuthError(
      AUTH_ERROR_CODES.NETWORK_ERROR,
      "A network error occurred. Please check your connection and try again."
    );
  }

  return createAuthError(
    AUTH_ERROR_CODES.UNKNOWN,
    "An unexpected error occurred during authentication."
  );
}
