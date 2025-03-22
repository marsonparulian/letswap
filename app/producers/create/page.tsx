import ProducerForm from '@/app/ui/producer-form';
import { createProducerAction } from '@/app/lib/actions/producer-actions';

export default async function createProducerPage() {

    return (
        <ProducerForm actionFunc={createProducerAction} />
    )
}