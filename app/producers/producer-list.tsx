// Component of list of producer
import CardList from '../ui/card-list';
import { deleteProducerAction } from '@/app/lib/actions/producer-actions';

export default async function ProducerList(
    { producers }: { producers: Producer[] }
) {

    await new Promise(r => setTimeout(r, 4000));

    // add required props for the list
    const producerList = producers.map((p) => {
        return {
            ...p,
            // edit link
            editHref: `/producers/edit/${p.slug}`,
            // form action for deletion
            deleteAction: deleteProducerAction.bind(null, p.id),
        }
    });


    return (
        <CardList items={producerList} />

    );
}