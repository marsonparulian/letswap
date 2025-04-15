import CollForm from '@/app/ui/coll-form';

export default function GenerateCollectionPage() {

    return (
        <form >
            <header>
                <h1>Generate New Collectibles</h1>
            </header>

            <CollForm />

            <div className="button-group align-center">
                <button className="button" type="submit">Generate</button>
            </div>
        </form>
    )
}