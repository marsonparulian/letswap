// Form to create / edit producer
'use client';
import { useActionState } from 'react';
import { producerFormState as ProducerFormState } from '@/app/lib/actions/producer-actions';

export default function ProducerForm(
    { actionFunc, producer }: {
        actionFunc: (state: ProducerFormState, f: FormData) => Promise<ProducerFormState>
        producer?: Producer
    }) {

    const initialSate: ProducerFormState = { errors: {}, message: null }
    const [formState, formAction] = useActionState(actionFunc, initialSate);
    console.log('formState: ');
    console.log(formState);

    return (
        <form action={formAction}>

            <div className="grid-container">
                <header>
                    <h1>Producer <span className="show-for-sr">Form</span></h1>
                </header>

                {/* slug */}
                <div className="grid-x grid-padding-x">
                    <div className="medium-6 cell">
                        <label>
                            Slug
                            <input
                                name="slug"
                                defaultValue={producer?.slug}
                                type="text"
                                placeholder="Slug will be used in URL only"
                                aria-describedby="slug-help-text" />
                        </label>
                        <div className="help-text" id="slug-help-text" aria-live="polite" aria-atomic="true">
                            {/* Show message if no form error */}
                            {!formState.errors?.slug && <p className="label secondary">Only accepts alphanumeric, _ (underscore), and .(period)</p>}
                            {/* Show error messages */}
                            {formState.errors?.slug && formState.errors.slug.map((e, k) => {
                                return <span key={`slug-error-${k}`} className="label alert">{e}</span>
                            })}
                        </div>
                    </div>
                </div>

                {/* name */}
                <div className="grid-x grid-padding-x">
                    <div className="medium-6 cell">
                        <label>
                            Name
                            <input name="name"
                                defaultValue={producer?.name}
                                type="text"
                                placeholder="The name of the collection producer"
                                aria-describedby="name-help-text" />
                        </label>
                        <div className="help-text" id="name-help-text" aria-live="polite" aria-atomic="true">
                            {/* Show message if no form error */}
                            {!formState.errors?.name && <span className="label secondary" >Only use alphanumeric, space, _ (underscore), and . (period)</span>}
                            {/* Show error messages */}
                            {formState.errors?.name && formState.errors.name.map((e, k) => {
                                return <span key={`name-error-${k}`} className="label alert">{e}</span>
                            })}
                        </div>

                    </div>
                </div>


                {/* description */}
                <div className="grid-x grid-padding-x">
                    <div className="medium-6 cell">
                        <label>
                            Description
                            <textarea name="description"
                                defaultValue={producer?.description}
                                placeholder="Description of the producer"
                                aria-describedby="description-help-text" />
                        </label>
                        <div className="help-text" id="description-help-text">
                            {/* Showhint when no error message */}
                            {!formState.errors?.description && <span className="label secondary">Maximum 4000 characters (FIXME)</span>}
                            {/* Show error messages */}
                            {formState.errors?.description && formState.errors.description.map((e, k) => <span key={`description-error-${k}`} className="label alert">{e}</span>)}
                        </div>
                    </div>
                </div>


                {/* Buttons */}
                <div >
                    <button className="button" type="submit">Save <span className="show-for-sr">Producer</span></button>
                </div>
            </div>
        </form >
    )
}