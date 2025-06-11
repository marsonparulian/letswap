/**
 * Session Error Handling System
 *
 * USE CASES:
 * - Detecting and managing session timeouts
 * - Handling forced logouts due to security events
 * - Notifying users when signing in on multiple devices
 * - Supporting JWT token rotation failures
 * - Identifying session-specific errors for appropriate UI responses
 */
import { AUTH_ERROR_CODES, AuthError, createAuthError } from "./auth-errors";

/**
 * Session-specific error codes
 */
export const SESSION_ERROR_CODES = {
  EXPIRED: AUTH_ERROR_CODES.SESSION_EXPIRED,
  INVALID: "session.invalid",
  MULTI_DEVICE: "session.multi_device_conflict",
};

/**
 * Handles session expiration errors
 *
 * @returns AuthError for expired sessions
 */
export function handleSessionExpired(): AuthError {
  return createAuthError(
    SESSION_ERROR_CODES.EXPIRED,
    "Your session has expired. Please sign in again to continue."
  );
}

/**
 * Handles invalid session errors
 *
 * @returns AuthError for invalid sessions
 */
export function handleInvalidSession(): AuthError {
  return createAuthError(
    SESSION_ERROR_CODES.INVALID,
    "Your session is invalid. Please sign in again."
  );
}

/**
 * Handles multi-device session conflicts
 *
 * @returns AuthError for multi-device conflicts
 */
export function handleMultiDeviceConflict(): AuthError {
  return createAuthError(
    SESSION_ERROR_CODES.MULTI_DEVICE,
    "Your session was terminated because you signed in on another device."
  );
}

/**
 * Determines if the given error is a session-related error
 *
 * @param error - The error to check
 * @returns Boolean indicating if it's a session error
 */
export function isSessionError(error: AuthError): boolean {
  return Object.values(SESSION_ERROR_CODES).includes(error.code);
}

/**
 * Handles session token rotation failures
 *
 * @returns AuthError for token rotation failures
 */
export function handleTokenRotationFailure(): AuthError {
  return createAuthError(
    SESSION_ERROR_CODES.INVALID,
    "Unable to refresh your session. Please sign in again."
  );
}
