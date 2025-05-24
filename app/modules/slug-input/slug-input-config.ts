// This file contains configurationrelated to slug input
export const SLUG_REGEX = /^[a-zA-Z0-9_.\-]+$/;
export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 500;
export const DEBOUNCE_DELAY = 500; // milliseconds

export const TEXT_INFO =
  "Only accepts alphanumeric, _ (underscore), - (hyphen), and .(period)";
// The term `valid` in this module refers to the slug being valid in terms of format and uniqueness.
export const TEXT_VALIDATING = "Validating slug...";
export const TEXT_INVALID = "Invalid slug";
export const TEXT_INVALID_LENGTH = `Slug must be between ${SLUG_MIN_LENGTH} and ${SLUG_MAX_LENGTH} characters (inclusive)`;
export const TEXT_INVALID_CHARACTERS =
  "Slug can only contain alphanumeric characters, _ (underscore), - (hyphen), and .(period)";
export const TEXT_UNAVAILABLE = "Slug is unavailable";
export const TEXT_OK = "Valid! Slug is available";

export type SlugValidationResult = {
  slug: string;
  // True if the slug is currently being validated.
  isValidating?: boolean;
  // `isValid` indicates if the slug is valid in terms of format and uniqueness.
  // If it is `null`, it means the slug is empty or has not been validated yet.
  isValid: boolean | null;
  // If it is `null`, it means has not tested the uniqueness yet.
  isUnique?: boolean | null;
  // `iError` indicates if there was an technical error during validation.
  isError?: boolean;
  message: string | null;
};
