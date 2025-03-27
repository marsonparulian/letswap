// Page containing list of producer
import { getProducers } from '@/app/lib/data/producers';
import ProducerList from './producer-list';
import { Suspense } from 'react';
import ProducerListSkeleton from './producer-list-skeleton';

export default async function ProducerPage() {

    // load producers
    const producers = await getProducers();

    return (
        <>
            <h1><span className="show-for-sr">Page containing {producers.length}</span>Producers</h1>
            <Suspense fallback={<ProducerListSkeleton />}>
                <ProducerList producers={producers} />
            </Suspense>
        </>
    )
}