// Contain actions related to `producer`
'use server';

import z from 'zod';
import { sql } from '@/app/lib/data/utils';
import { tableName, updateProducer, deleteProducer } from '@/app/lib/data/producers'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type RawFormProducer = {
    id: FormDataEntryValue | null,
    slug: FormDataEntryValue | null,
    name: FormDataEntryValue | null,
    description: FormDataEntryValue | null,
}

const ProducerSchema = z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
});

export async function createProducerAction(formData: FormData) {
    const { slug, name, description } = ProducerSchema.omit({
        id: true,
    }).parse(parseFormData(formData));

    // Saving new producer
    await sql`
        INSERT INTO ${sql(tableName)} (slug, name, description)
        VALUES (${slug}, ${name}, ${description})
        RETURNING *
    `;

    // Revalidate path & redirect
    revalidatePath('/producers/');
    redirect('/producers');
}

export async function editProducerAction(id: string, formData: FormData) {

    const rawFormData = parseFormData(formData);

    const validatedFormData = ProducerSchema.omit({
        id: true,
    }).parse(rawFormData);

    await updateProducer({
        id: id,
        ...validatedFormData
    });

    // Revalidate and redirect
    revalidatePath('/producers/');
    redirect('/producers');

}
function parseFormData(formData: FormData): RawFormProducer {
    const producer = {
        id: formData.get('id'),
        slug: formData.get('slug'),
        name: formData.get('name'),
        description: formData.get('description'),
    };

    return producer;
}

export async function deleteProducerAction(id: string) {
    await deleteProducer(id);

    // Revalidate
    revalidatePath('/producers/');
}