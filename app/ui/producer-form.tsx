export default function ProducerForm() {
    return (
        <form>
            <div className="grid-container">
                <header>
                    <h1>Producer <span className="show-for-sr">Form</span></h1>
                </header>

                {/* slug */}
                <div className="grid-x grid-padding-x">
                    <div className="medium-6 cell">
                        <label>
                            Slug
                            <input type="text" placeholder="Slug will be used in URL only" aria-describedby="slug-help-text" />
                        </label>
                        <p className="help-text" id="slug-help-text">Only accepts alphanumeric, _ (underscore), and .(period)</p>
                    </div>
                </div>

                {/* name */}
                <div className="grid-x grid-padding-x">
                    <div className="medium-6 cell">
                        <label>
                            Name
                            <input type="text" placeholder="NThe name of the collection producer" aria-describedby="name-help-text"/>
                        </label>
<p className="help-text" id="name-help-text">Only use alphanumeric, space, _ (underscore), and . (period)</p>
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