// Component of list of producer
import CardList from '../ui/card-list';
import { Producer } from '@/types';
import { deleteProducerAction } from '@/app/lib/actions/producer-actions';

export default function ProducerList(
    { producers }: { producers: Producer[] }
) {

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