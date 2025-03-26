// General error page
'use client';

import { useEffect } from 'react';

export default function ErrorPage(
    { error, reset }:
        {
            error: Error & { digest: string },
            reset: () => void
        }
) {

    useEffect(() => {
        console.error(error);
    });

    return (
        <div className="grid-container">
            <div className="grid-x grid-padding-x align-center-middle text-center">
                <div className="cell medium-6">
                    <h1 className="alert alert-danger">An error occurred</h1>
                    <p className="alert red">{error.message}</p>
                    <button className="button alert" onClick={reset}>Try Again</button>
                </div>
            </div>
        </div>
    )

}