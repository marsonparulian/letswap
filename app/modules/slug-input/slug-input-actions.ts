"use server";

// This file contains actions for managing slug inputs in a web application.
// It includes functions to validate the slug format, check for uniqueness, and update the slug state.
// The code is designed to be used in a React application with TypeScript.

import { checkSlugUniqueness } from "@/app/lib/data/utils";
import { tableName as producerTableName } from "@/app/lib/data/producers";
import {
  SLUG_REGEX,
  SLUG_MIN_LENGTH,
  SLUG_MAX_LENGTH,
  TEXT_OK,
  TEXT_INVALID,
  TEXT_INVALID_LENGTH,
  TEXT_INVALID_CHARACTERS,
  TEXT_UNAVAILABLE,
  type SlugValidationResult,
} from "@/app/modules/slug-input/slug-input-config";

/**
 * Validate a slug based on the following criteria:
 * @param slug - The slug to validate.
 * @returns
 */
export const validateSlug = async (
  slug: string,
  tableName: string
): Promise<SlugValidationResult> => {
  let message = TEXT_OK;
  let isValid = true;
  let isUnique = null;
  let isError = false;
  // After finish, no longer validating
  let isValidating = false;

  // Check if the slug is empty
  if (slug.length === 0) {
    isValid = false;
    message = TEXT_INVALID;
  } else if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
    isValid = false;
    message = TEXT_INVALID_LENGTH;
  } else if (!SLUG_REGEX.test(slug)) {
    isValid = false;
    message = TEXT_INVALID_CHARACTERS;
  }

  // If valid, check the uniqueness
  try {
    if (isValid) {
      isUnique = await checkSlugUniqueness(slug, tableName);
      if (!isUnique) {
        isValid = false;
        message = TEXT_UNAVAILABLE;
      }
    }
  } catch (e) {
    console.error("Error checking slug uniqueness:", e);
    isError = true;
    message = "Error checking slug uniqueness";
  }

  return {
    slug,
    isValid,
    isUnique,
    isError,
    message,
    isValidating,
  };
};

/**
 * Check if the slug is unique by making a request to the server.
 * @param slug - The slug to check for uniqueness.
 * @returns A promise that resolves to a boolean indicating whether the slug is unique.
 */
export const checkSlugForProducers = async (
  slug: string
): Promise<SlugValidationResult> => {
  return await validateSlug(slug, producerTableName);
};
