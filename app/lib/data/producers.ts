import { sql } from '@/app/lib/data/utils';

// Main data related functions to a specific table
export const tableName = 'producers';

export async function getProducers(): Promise<Producer[]> {
    try {
        const producers = await sql<Producer[]>`
            SELECT * FROM ${sql(tableName)}
        `;
        return producers;
    } catch (error) {
        console.error('Failed fetching producers', error);
        throw new Error('Failed to fetch producers');
    }
}

export async function createProducer(producer: Producer): Promise<Producer> {

    try {
        const [savedProducer] = await sql<Producer[]>`
            INSERT INTO ${sql(tableName)} (slug, name, description)
            VALUES (${producer.slug}, ${producer.name}, 
            ${producer.description})
            RETURNING *
        `;
        return savedProducer;
    } catch (error) {
        console.error('Failed to create producer', error);
        throw new Error('Failed to create producer');
    }
}

export async function getProducerBySlug(slug: string): Promise<Producer> {
    try {
        const producers = await sql<Producer[]>`
            SELECT * FROM ${sql(tableName)}
            WHERE slug = ${slug}
        `;
        return producers[0];
    } catch (error) {
        console.error(`Failed fetching producer by slug :${slug}`, error);
        throw new Error(`Failed to fetch producer by slug: ${slug}`);
    }
}

export async function updateProducer(producer: Producer): Promise<boolean> {
    try {
        console.log('going to update producer');
        console.log(producer);

        const updatedProducer = await sql`
        UPDATE ${sql(tableName)}
        SET
            slug = ${producer.slug},
            name = ${producer.name},
            description = ${producer.description}
        WHERE id = ${producer.id}
        RETURNING *
        `;

        console.log(`updatedProducer: ${updatedProducer}`);
        console.log(updatedProducer)
        return true;
    } catch (error) {
        console.error(`Error updating producer: ${producer}`);
        console.error(error);
        throw new Error(`Error updating producer: ${producer}`);;
    }
}

export async function deleteProducer(id: string) {
    try {
        return sql`
DELETE FROM ${sql(tableName)}
WHERE id = ${id}
`;
    } catch (error) {
        console.error(`Error delete producer id ${id}`);
        console.error(error);
        throw new Error(`Error deleting producer id: ${id}`);
    }
}
