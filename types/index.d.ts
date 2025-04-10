declare global {
    export type Producer = {
        id: number;
        slug: string;
        name: string;
        description: string;
    };

    export type CollectionItem = {
        id: number,
        collectionId: number,
        name: string,
        description: string,
        // The order in the collection
        orderNumber: number,
    }
    export type Collection = {
        id: number,
        slug: string,
        name: string,
        description: string,
        // Number of items
        itemsCount: number,
        producerId: number,
        imageUrl: string,
        year: number,
        // The date the collection was created
        createdAt: Date,
    }
}
export { };