// Purpose: Drop collections table
import { tableName } from '@/app/lib/data/collections';
import { sql } from '@/app/lib/data/utils';

async function dropCollections() {
    return sql`DROP TABLE IF EXISTS ${sql(tableName)};`;
}

export async function GET() {
    try {
        const result = await sql.begin((sql) => [
            dropCollections(),
        ]);

        return Response.json({ message: `Table ${tableName} has been dropped` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
