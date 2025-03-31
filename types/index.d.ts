declare global {
    export type Producer = {
        id: string;
        slug: string;
        name: string;
        description: string;
    };

    export type CollectionItem = {
        id: string,
        collectionId: string,
        name: string,
        desc: string,
        // The order in the collection
        order_number: number,
    }
    export type Collection = {
        id: string,
        slug: string,
        name: string,
        desc: string,
        // Number of items
        items_count: number,
        producerId: string,
        imageUrl: string,
        year: number,
        // The date the collection was created
        created_at: Date,
    }
}
export { };