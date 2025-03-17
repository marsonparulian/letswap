// Purpose: Drop collection_items table

import { tableName } from '@/app/lib/data/collection_items';
import { sql } from '@/app/lib/data/utils';

async function dropCollectionItems() {
    return sql`DROP TABLE IF EXISTS ${sql(tableName)} ;`;
}

export async function GET() {
    try {
        await sql.begin(() => [
            dropCollectionItems(),
        ]);

        return Response.json({ message: `Table ${tableName} has been dropped` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
