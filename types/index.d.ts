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

    // SnakeCase helper type, to convert from camelCase  to snake_case
    type SnakeCase<S extends string> =
        S extends `${infer Head}${infer Tail}`
        ? Tail extends Uncapitalize<Tail>
        ? `${Lowercase<Head>}${SnakeCase<Tail>}`
        : `${Lowercase<Head>}_${SnakeCase<Tail>}`
        : S;

    // Type to convert camelCase based type to snake_case, to represent table in DB
    export type CamelToSnake<T> = {
        [K in keyof T as K extends string ? SnakeCase<K> : never]: T[K]
    };



}
export { };