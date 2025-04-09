// Purpose : Create collections table.
import { tableName } from '@/app/lib/data/collections';
import { sql } from '@/app/lib/data/utils';

async function createCollections() {
    // Check if the table already exists
    await sql`DROP TABLE IF EXISTS ${sql(tableName)};`;
    // Create the table
    return sql`
        CREATE TABLE IF NOT EXISTS ${sql(tableName)}(
                id SERIAL PRIMARY KEY,
                slug VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                desc TEXT,
                items_count INT NOT NULL,
                producer_id INT NOT NULL REFERENCES producers(id),
                image_url VARCHAR(255),
                year INT CHECK (year >= 1000 AND year <= 9999),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
}

export async function GET() {
    try {
        console.log('start of creating table');
        await sql.begin(() => [
            createCollections(),
        ]);

        return Response.json({ message: `Table ${tableName} has been created` });
    } catch (error) {
        console.log('error creating table');
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}

