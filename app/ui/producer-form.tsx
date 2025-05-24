// Form to create / edit producer
"use client";
import { useActionState } from "react";
import { producerFormState as ProducerFormState } from "@/app/lib/actions/producer-actions";
import SlugInput from "@/app/modules/slug-input/slug-input-component";
import { checkSlugForProducers } from "@/app/modules/slug-input/slug-input-actions";

export default function ProducerForm({
  actionFunc,
  producer,
}: {
  actionFunc: (
    state: ProducerFormState,
    f: FormData
  ) => Promise<ProducerFormState>;
  producer?: Producer;
}) {
  const initialSate: ProducerFormState = { errors: {}, message: null };
  const [formState, formAction] = useActionState(actionFunc, initialSate);
  console.log("formState: ");
  console.log(formState);

  return (
    <form action={formAction}>
      <div className="grid-container">
        <header>
          <h1>
            Producer <span className="show-for-sr">Form</span>
          </h1>
        </header>

        {/* name */}
        <div className="grid-x grid-padding-x">
          <div className="medium-6 cell">
            <label>
              Name
              <input
                name="name"
                defaultValue={producer?.name}
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

        {/* slug */}
        <div className="grid-x grid-padding-x">
          <div className="medium-6 cell">
            <SlugInput
              slugCheckFunction={checkSlugForProducers}
              propsValidationResult={{
                slug: producer?.slug || "",
                // If there are no errors, set to 'null' to indicate 'neutral' state. 'success' state will be determined by the slug check function.
                isValid: formState.errors?.slug ? false : null,
                // On initial state we do not know if the slug is unique or not
                isUnique: null,
                message: formState.errors?.slug?.join(". ") || "",
                isValidating: false,
              }}
            />
          </div>
        </div>

        {/* description */}
        <div className="grid-x grid-padding-x">
          <div className="medium-6 cell">
            <label>
              Description
              <textarea
                name="description"
                defaultValue={producer?.description}
                placeholder="Description of the producer"
                aria-describedby="description-help-text"
              />
            </label>
            <div className="help-text" id="description-help-text">
              {/* Showhint when no error message */}
              {!formState.errors?.description && (
                <span className="label secondary">
                  Maximum 4000 characters (FIXME)
                </span>
              )}
              {/* Show error messages */}
              {formState.errors?.description &&
                formState.errors.description.map((e, k) => (
                  <span key={`description-error-${k}`} className="label alert">
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
  );
}
