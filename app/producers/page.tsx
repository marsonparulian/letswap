// Page containing list of producer
import { getProducers } from '@/app/lib/data/producers';
import ProducerList from './producer-list';

export default async function ProducerPage() {

    // load producers
    const producers = await getProducers();

    return (
        <>
            <h1><span className="show-for-sr">Page containing {producers.length}</span>Producers</h1>
            <ProducerList producers={producers} />
        </>
    )
}