// Form to generate new collections
"use client";

import type { CollFormState } from "../lib/actions/collection-actions";
import { useActionState } from "react";
import { toast } from "react-hot-toast";
import * as texts from "@/app/lib/texts/texts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CollectionForm({
  producers,
  coll,
  actionFunc,
}: {
  producers: Producer[];
  coll?: Collection;
  actionFunc: (
    prevState: CollFormState,
    formData: FormData
  ) => Promise<CollFormState>;
}) {
  const router = useRouter();
  const defaultState: CollFormState = {
    errors: {},
    message: "",
  };

  const [formState, formAction] = useActionState(actionFunc, defaultState);

  // Handle form state changes
  useEffect(() => {
    console.log("Form state changed:", formState);
    if (formState?.success) {
      // Use router.push instead of redirect for client-side navigation
      router.push("/collections");

      // Show success toast
      toast.success(texts.savedSuccessfully("Collection"), { duration: 5000 });
    }
  }, [formState, router]);

  return (
    <>
      <form action={formAction} id="coll-form">
        <div className="grid-container">
          <header>
            <h1>
              Collection <span className="show-for-sr">Form</span>
            </h1>
          </header>

          {/* producer-id */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Producer
                <select
                  name="producerId"
                  defaultValue={coll?.producerId || ""}
                  aria-describedby="producer-id-help-text"
                >
                  {/* Empty option */}
                  <option value="" disabled>
                    Select a producer
                  </option>
                  {/* Map producers to options */}
                  {producers.map((producer) => (
                    <option key={producer.id} value={producer.id}>
                      {producer.name}
                    </option>
                  ))}
                </select>
              </label>
              <div
                className="help-text"
                id="producer-id-help-text"
                aria-live="polite"
                aria-atomic="true"
              >
                {/* Show message if no form error */}
                {!formState?.errors?.producerId && (
                  <span className="label secondary">select producer, sir</span>
                )}
                {/* Show error messages */}
                {formState?.errors?.producerId &&
                  formState.errors.producerId.map((e, k) => (
                    <span
                      key={`producer-id-error-${k}`}
                      className="label alert"
                    >
                      {e}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* slug */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Slug
                <input
                  name="slug"
                  defaultValue={coll?.slug}
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
                {/* Show message if no form error */}
                {!formState.errors?.slug && (
                  <p className="label secondary">
                    Only accepts alphanumeric, _ (underscore), and .(period)
                  </p>
                )}
                {/* Show error messages */}
                {formState.errors?.slug &&
                  formState.errors.slug.map((e, k) => {
                    return (
                      <span key={`slug-error-${k}`} className="label alert">
                        {e}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* name */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Name
                <input
                  name="name"
                  defaultValue={coll?.name}
                  type="text"
                  placeholder="The name of the collection producer"
                  aria-describedby="name-help-text"
                />
              </label>

              <div
                className="help-text"
                id="name-help-text"
                aria-live="polite"
                aria-atomic="true"
              >
                {/* Show message if no form error */}
                {!formState.errors?.name && (
                  <span className="label secondary">
                    Only use alphanumeric, space, _ (underscore), and . (period)
                  </span>
                )}
                {/* Show error messages */}
                {formState.errors?.name &&
                  formState.errors.name.map((e, k) => {
                    return (
                      <span key={`name-error-${k}`} className="label alert">
                        {e}
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* description */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Description
                <textarea
                  name="description"
                  defaultValue={coll?.description}
                  placeholder="Description of the producer"
                  aria-describedby="description-help-text"
                />
              </label>
              <div className="help-text" id="description-help-text">
                {/* Showhint when no error message */}
                {!formState.errors?.description && (
                  <span className="label secondary">
                    Maximum 5000 characters
                  </span>
                )}
                {/* Show error messages */}
                {formState.errors?.description &&
                  formState.errors.description.map((e, k) => (
                    <span
                      key={`description-error-${k}`}
                      className="label alert"
                    >
                      {e}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* itemsCount */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Number of Items
                <input
                  name="itemsCount"
                  defaultValue={coll?.itemsCount}
                  type="number"
                  min="1"
                  placeholder="Total number of items in collection"
                  aria-describedby="count-items-help-text"
                />
              </label>
              <div
                className="help-text"
                id="items-count-help-text"
                aria-live="polite"
                aria-atomic="true"
              >
                {/* Show message if no form error */}
                {!formState.errors?.itemsCount && (
                  <span className="label secondary">Must be at least 1</span>
                )}
                {/* Show error messages */}
                {formState.errors?.itemsCount &&
                  formState.errors.itemsCount.map((e, k) => (
                    <span
                      key={`items-count-error-${k}`}
                      className="label alert"
                    >
                      {e}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* year */}
          <div className="grid-x grid-padding-x">
            <div className="medium-6 cell">
              <label>
                Year
                <input
                  name="year"
                  defaultValue={coll?.year}
                  type="number"
                  min="1900"
                  max="2100"
                  placeholder="Year the collection was released"
                  aria-describedby="year-help-text"
                />
              </label>
              <div
                className="help-text"
                id="year-help-text"
                aria-live="polite"
                aria-atomic="true"
              >
                {/* Show message if no form error */}
                {!formState.errors?.year && (
                  <span className="label secondary">
                    Enter a valid year between 1900-2100
                  </span>
                )}
                {/* Show error messages */}
                {formState.errors?.year &&
                  formState.errors.year.map((e, k) => (
                    <span key={`year-error-${k}`} className="label alert">
                      {e}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <button className="button" type="submit">
              Save <span className="show-for-sr">Producer</span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
