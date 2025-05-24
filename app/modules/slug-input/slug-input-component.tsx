"use-client";

// This file contains the SlugInput component, which is a controlled input field for slugs.
// It includes validation for the slug format and checks for uniqueness against a database.

import { useState, useEffect } from "react";
import slugify from "slugify";
import { useDebounce } from "use-debounce";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import clsx from "clsx";

export default function SlugInput({
  slugCheckFunction,
  propsValidationResult,
}: {
  slugCheckFunction: (
    slug: string
  ) => Promise<slugInputConfig.SlugValidationResult>;
  propsValidationResult: slugInputConfig.SlugValidationResult;
}) {
  // State to manage the slug input value, validation result state
  const [valResult, setValResult] =
    useState<slugInputConfig.SlugValidationResult>(propsValidationResult);
  const [currentSlug, setCurrentSlug] = useState(
    propsValidationResult.slug || ""
  );
  const [debouncedSlug] = useDebounce(
    currentSlug,
    slugInputConfig.DEBOUNCE_DELAY
  );

  // Handle debounced slug validation
  useEffect(() => {
    const validateSlug = async () => {
      if (!debouncedSlug) return;

      // Set validating state
      setValResult((prev) => ({
        ...prev,
        message: slugInputConfig.TEXT_VALIDATING,
        slug: debouncedSlug,
        isValidating: true,
      }));

      // Validate the slug
      const result = await slugCheckFunction(debouncedSlug);
      setValResult(result);
    };

    validateSlug();
  }, [debouncedSlug, slugCheckFunction]);

  // Handle name input changes for auto-generating slug
  useEffect(() => {
    const handleNameChange = async () => {
      const nameInput = document.querySelector(
        'input[name="name"]'
      ) as HTMLInputElement;
      if (!nameInput) return;

      const slugInput = document.querySelector(
        'input[name="slug"]'
      ) as HTMLInputElement;
      if (!slugInput) return;

      // Listen for changes in the name input
      const onChange = async () => {
        const nameValue = nameInput.value;
        if (!nameValue) return;

        // Can't use the `currentSlug` directly here because it might not be updated yet
        const slugValue = slugInput.value;
        // Don't update if current slug is not empty
        if (slugValue) return;

        // Generate slug from name
        const suggestedSlug = slugify(nameValue, {
          lower: true,
          strict: true,
        });

        // Update the slug value which will trigger the debounced validation
        setCurrentSlug(suggestedSlug);
      };

      nameInput.addEventListener("change", onChange);
      return () => nameInput.removeEventListener("change", onChange);
    };

    handleNameChange();
    // }, [currentSlug]);
  }, []);

  return (
    <>
      <label>
        Slug
        <input
          name="slug"
          value={currentSlug}
          type="text"
          placeholder="Slug will be used in URL only"
          aria-describedby="slug-help-text"
          onChange={(e) => setCurrentSlug(e.target.value)}
        />
      </label>
      <div
        className="help-text"
        id="slug-help-text"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        <p
          className={clsx("label", {
            success: valResult.isValid && valResult.isUnique,
            alert: valResult.isValid === false || valResult.isUnique === false,
            secondary: valResult.isValidating || valResult.isValid === null,
          })}
        >
          {valResult.message || slugInputConfig.TEXT_INFO}
        </p>
      </div>
    </>
  );
}
