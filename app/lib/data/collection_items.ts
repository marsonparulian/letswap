import { sql, tableToObject } from '@/app/lib/data/utils';

// Main data related functions to a specific table
export type CollItemRow = CamelToSnake<CollectionItem>;

export const tableName = 'collection_items';

export async function deleteCollItems() {
    return sql`DELETE FROM  ${sql(tableName)}`;
}

/**
 * Save many collection items
 * @param items List of collection item to be saved in DB
 */
export async function createMany(items: CollectionItem[]) {
    if (items.length === 0) {
        return;
    }

    await sql`
    INSERT INTO collection_items ${sql(
        items.map(item => ({
            ...item,
            collection_id: item.collectionId,
            order_number: item.orderNumber,
        })),
        'name', 'collection_id', 'description', 'order_number'
    )}
    `;
}

export async function retrieveByCollection(collId: number): Promise<CollectionItem[]> {
    const collItemRows: CollItemRow[] = await sql<CollItemRow[]>`SELECT * FROM  ${sql(tableName)} WHERE collection_id = ${collId}`;

    const collItems: CollectionItem[] = collItemRows.map((row) => tableToObject(row));
    return collItems;

}