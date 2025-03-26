// Contain actions related to `producer`
'use server';

import z from 'zod';
import { sql } from '@/app/lib/data/utils';
import { tableName, updateProducer, deleteProducer } from '@/app/lib/data/producers'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Form state
export type producerFormState = {
    errors?: {
        slug?: string[],
        name?: string[],
        description?: string[],
    },
    message?: string | null,
}

type RawFormProducer = {
    id: FormDataEntryValue | null,
    slug: FormDataEntryValue | null,
    name: FormDataEntryValue | null,
    description: FormDataEntryValue | null,
}

const ProducerSchema = z.object({
    id: z.string(),
    slug: z.string({
        invalid_type_error: 'Invalid type. Expected string.',
    }).min(3, 'Slug must be at least 3 characters'),
    name: z.string({
        invalid_type_error: 'Invalid type',
    }).min(3, 'Name must be at least 3 characters'),
    description: z.string({
        invalid_type_error: 'Invalid type',
    }).min(3, 'Description must be at least 3 characters'),
});

export async function createProducerAction(prevState: producerFormState, formData: FormData) {
    const validatedData = ProducerSchema.omit({
        id: true,
    }).safeParse(parseFormData(formData));

    // Check for invalid
    if (!validatedData.success) {
        console.log('Data is invalid');
        return {
            errors: validatedData.error.flatten().fieldErrors,
            message: 'Failed saving producer',
        }
    }
    console.log('Data is valid');

    // Continue with valid data.
    const { slug, name, description } = validatedData.data;

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

export async function editProducerAction(id: string, prevState: producerFormState, formData: FormData) {

    const rawFormData = parseFormData(formData);

    const validatedFormData = ProducerSchema.omit({
        id: true,
    }).safeParse(rawFormData);

    if (!validatedFormData.success) {
        return {
            errors: validatedFormData.error.flatten().fieldErrors,
            message: 'Failed saving producer',
        }
    }

    await updateProducer({
        id: id,
        ...validatedFormData.data,
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