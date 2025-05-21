"use-client";

// This file contains the SlugInput component, which is a controlled input field for slugs.
// It includes validation for the slug format and checks for uniqueness against a database.

import { useState } from "react";
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
  // State to manage the slug input value
  // Use props to initialize the state
  let [valResult, setValResult] =
    useState<slugInputConfig.SlugValidationResult>(propsValidationResult);

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
        />
      </label>
      <div
        className="help-text"
        id="slug-help-text"
        aria-live="polite"
        aria-atomic="true"
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
