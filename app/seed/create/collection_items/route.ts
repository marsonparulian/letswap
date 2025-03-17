// Purpose : Create collection_items table.
import { sql } from '@/app/lib/data/utils';

const tableName = 'collection_items';

async function createCollectionItems() {
    return sql`
    CREATE TABLE IF NOT EXISTS ${sql(tableName)}(
      id SERIAL PRIMARY KEY,
      collection_id INT NOT NULL REFERENCES collections(id),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      order_number SMALLINT NOT NULL
    );
  `;
}

export async function GET() {
    try {
        const result = await sql.begin((sql) => [
            createCollectionItems(),
        ]);

        return Response.json({ message: `Table ${tableName} has been created` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

