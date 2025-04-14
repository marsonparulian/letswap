// Main data related functions to a specific table
import { sql, tableToObject } from '@/app/lib/data/utils';
import * as collItems from '@/app/lib/data/collection_items';

export const tableName = 'collections';
// Type to represent a collection in DB table
export type CollectionRow = CamelToSnake<Collection>;


export async function deleteCollections(): Promise<void> {
    await sql`DELETE FROM ${sql(tableName)}`;
}

export async function retrieve(): Promise<Collection[]> {
    const result: CollectionRow[] = await sql<CollectionRow[]>`SELECT * FROM ${sql(tableName)}`;
    return result.map((row: CollectionRow) => {
        return tableToObject(row);
    });
}

export async function retrieveById(id: number): Promise<Collection | null> {
    const [row] = await sql <CollectionRow[]>`
        SELECT * FROM ${sql(tableName)}
        WHERE id = ${id};
    `;

    // Return if null
    if (row === null) return null;

    const coll = tableToObject(row);

    // attach collection items
    coll.items = await collItems.retrieveByCollection(coll.id);

    return coll;
}
/**
 * Retrieve list of collection by keyword in  `slug` and `name`
 * @param keyword String to search the collections
 * @returns 
 */
export async function retrieveByKeyword(keyword: string): Promise<Collection[]> {
    // Sanitize the keyword
    const k = `%${keyword.replace(/[%_]/g, '\\$&')}%`;

    // Query the `k` in `slug` and `name`
    const collRows: CollectionRow[] = await sql<CollectionRow[]>`
        SELECT * FROM ${sql(tableName)}
        WHERE slug LIKE ${k} OR name LIKE ${k};
    `;

    const colls: Collection[] = collRows.map((row) => tableToObject(row));;
    return colls;
}
export async function createCollection(coll: Collection): Promise<Collection> {
    // Do not save `id` and `createdAt` fields, they are auto-generated
    const [createdRow] = await sql<CollectionRow[]>`
               INSERT INTO ${sql(tableName)} 
        (slug, name, description, items_count, producer_id, image_url, year)
        VALUES (${coll.slug}, ${coll.name}, ${coll.description}, 
        ${coll.itemsCount}, ${coll.producerId}, ${coll.imageUrl}, 
        ${coll.year})
        RETURNING *;
    `;

    // Convert to the created `collection`
    const createdCollection: Collection = tableToObject(createdRow);

    // Generate items based on the saved collection
    createdCollection.items = generateCollectionItemsByNumber(createdCollection);

    // Save the collection items
    await collItems.createMany(createdCollection.items);

    return createdCollection;
}
/**
 * Generate collection items by the value of `collection.itemsCount`
 * @param collection 
 * @returns 
 */
export function generateCollectionItemsByNumber(collection: Collection): CollectionItem[] {
    return Array.from({ length: collection.itemsCount }, (_, index) => ({
        id: 0,
        collectionId: collection.id,
        orderNumber: index + 1,
        name: `${index + 1}`,
        description: "",
    }));
}