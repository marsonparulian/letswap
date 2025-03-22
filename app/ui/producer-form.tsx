// Form to create / edit producer
import { Producer } from '@/types';

export default function ProducerForm(
    { actionFunc, producer }: {
        actionFunc: (f: FormData) => Promise<void>
        producer?: Producer
    }) {
    return (
        <form action={actionFunc}>

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
                        <p className="help-text" id="slug-help-text">Only accepts alphanumeric, _ (underscore), and .(period)</p>
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
                        <p className="help-text" id="name-help-text">Only use alphanumeric, space, _ (underscore), and . (period)</p>
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
                        <p className="help-text" id="description-help-text">
                            Msx 600 characters
                        </p>
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