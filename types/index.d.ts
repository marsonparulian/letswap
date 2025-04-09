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
        description: string,
        // The order in the collection
        orderNumber: number,
    }
    export type Collection = {
        id: string,
        slug: string,
        name: string,
        description: string,
        // Number of items
        itemsCount: number,
        producerId: string,
        imageUrl: string,
        year: number,
        // The date the collection was created
        createdAt: Date,
    }
}
export { };