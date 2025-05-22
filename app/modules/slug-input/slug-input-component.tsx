"use-client";

// This file contains the SlugInput component, which is a controlled input field for slugs.
// It includes validation for the slug format and checks for uniqueness against a database.

import { useState, useEffect } from "react";
import slugify from "slugify";
// import { useDebounce } from "use-debounce";

import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";

export default function SlugInput({
  slugCheckFunction,
  propsValidationResult,
}: {
  slugCheckFunction: (
    slug: string
  ) => Promise<slugInputConfig.SlugValidationResult>;
  propsValidationResult: slugInputConfig.SlugValidationResult;
}) {
  // State to manage the slug input value and readonly state
  let [valResult, setValResult] =
    useState<slugInputConfig.SlugValidationResult>(propsValidationResult);
  let [isReadOnly, setIsReadOnly] = useState(false);

  // Handle name input changes
  useEffect(() => {
    const handleNameChange = async () => {
      const nameInput = document.querySelector(
        'input[name="name"]'
      ) as HTMLInputElement;
      if (!nameInput) return;

      // Listen for changes in the name input
      const onChange = async () => {
        const nameValue = nameInput.value;
        if (!nameValue) return;

        // Generate slug from name
        const suggestedSlug = slugify(nameValue, {
          lower: true,
          strict: true,
        });

        // Make the slug input readonly while validating
        setIsReadOnly(true);

        // Set validating state
        setValResult((prev) => ({
          ...prev,
          message: "Validating slug...",
          slug: suggestedSlug,
        }));

        // Validate the suggested slug
        const result = await slugCheckFunction(suggestedSlug);
        setValResult(result);

        // Make the slug input editable again
        setIsReadOnly(false);
      };

      nameInput.addEventListener("change", onChange);
      return () => nameInput.removeEventListener("change", onChange);
    };

    handleNameChange();
  }, [slugCheckFunction]);

  return (
    <>
      <label>
        Slug
        <input
          name="slug"
          defaultValue={valResult.slug}
          type="text"
          placeholder="Slug will be used in URL only"
          aria-describedby="slug-help-text"
          readOnly={isReadOnly}
        />
      </label>
      <div
        className="help-text"
        id="slug-help-text"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {/* Show message */}
        <p
          className={`label ${
            !valResult.isValid || valResult.isUnique === false
              ? "alert"
              : "secondary"
          }`}
        >
          {valResult.message || slugInputConfig.TEXT_INFO}
        </p>
      </div>
    </>
  );
}
