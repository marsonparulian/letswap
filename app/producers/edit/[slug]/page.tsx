// Display producers edit page
import { getProducerBySlug } from '@/app/lib/data/producers';
import { editProducerAction } from '@/app/lib/actions/producer-actions';
import ProducerForm from '@/app/ui/producer-form';
import { notFound } from 'next/navigation';

export default async function EditProducerSlugPage(
    props: { params: Promise<{ slug: string }> }
) {
    // get the Producer by slug in params
    const params = await props.params;
    const slug = params.slug;
    const producer = await getProducerBySlug(slug);

    // If no producer is found, return 404
    if (!producer) {
        notFound();
    }

    // Bind form action
    const editProducerWithId = editProducerAction.bind(null, producer.id);

    return (
        <ProducerForm
            actionFunc={editProducerWithId}
            producer={producer}
        />
    )
}