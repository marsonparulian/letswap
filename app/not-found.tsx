// Global 404 page

export default function NotFoundPage() {
    return (
        <div className="grid-container">
            <div className="grid-x grid-padding-x align-center-middle text-center">
                <div className="cell medium-6">
                    <h1 className="alert alert-danger">Not Found</h1>
                    <p className="alert red">The page you are looking for does not exist.</p>
                </div>
            </div>
        </div>
    )
}