// Purpose : Create table
import { tableName } from '@/app/lib/data/producers';
import { sql } from '@/app/lib/data/utils';

async function createProducers() {
    return sql`
    CREATE TABLE IF NOT EXISTS ${sql(tableName)}(
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
async function seedProducers() {
    await createProducers();

    return sql`
        INSERT INTO ${sql(tableName)} (slug, name)
        VALUES ('coles', 'Coles Supermarket'), ('woolworths', 'Woolworths Supermarket')
    `;
}

export async function GET() {
    try {
        await sql.begin(() => [
            createProducers(),
            // Uncomment line below to populate the table
            // seedProducers()  
        ]);

        return Response.json({ message: `Table ${tableName} has been created` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

