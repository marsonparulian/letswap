// Purpose : Create collections table.
import { tableName } from '@/app/lib/data/collection_items';
import { sql } from '@/app/lib/data/utils';

async function createCollections() {
    return sql`
    CREATE TABLE IF NOT EXISTS ${sql(tableName)}(
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      items_number INT NOT NULL,
      producer_id INT NOT NULL REFERENCES producers(id),
      image_url VARCHAR(255) NOT NULL,
      year INT CHECK (year >= 1000 AND year <= 9999),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
}

export async function GET() {
    try {
        await sql.begin(() => [
            createCollections(),
        ]);

        return Response.json({ message: `Table ${tableName} has been created` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

