// Purpose: Drop `producers` table
import { tableName } from '@/app/lib/data/producers';
import { sql } from '@/app/lib/data/utils';

async function dropProducers() {
    return sql`DROP TABLE IF EXISTS ${sql(tableName)};`;
}

export async function GET() {
    try {
        await sql.begin(() => [
            dropProducers(),
        ]);

        return Response.json({ message: `Table ${tableName} has been dropped` });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
