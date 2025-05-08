/**
 * @jest-environment node
 */
// Note: set `testEnvironment` to `node`, because this test DB related functions
// About: this file test the `Collection` data layer
import { sql, closeSqlConnection } from '@/app/lib/data/utils';
import { tableName, deleteCollections, generateCollectionItemsByNumber, retrieve, retrieveById, retrieveByKeyword, createCollection } from '@/app/lib/data/collections';
import { tableName as producerTableName, createProducer, deleteProducer } from '@/app/lib/data/producers';
import { tableName as collItemTableName, deleteCollItems } from '@/app/lib/data/collection_items';
import { Exo_2 } from 'next/font/google';

describe('lib/data/collections', () => {
    const sampleCollections = [
        {
            id: 0,
            name: 'test collection',
            slug: 'test-collection',
            // Note: temporary producerId will be created for test
            producerId: 0,
            imageUrl: "",
            year: 2021,
            description: 'test description',
            itemsCount: 4,
            items: [],
            createdAt: new Date(),
        },
    ];

    it('should have the correct table name', () => {
        expect(tableName).toBe('collections');
    });

    beforeAll(async () => {
        createAndAppendProducers();
    });
    /**
     * Create temporary producers for test
     */
    async function createAndAppendProducers() {
        // Create temporary producer
        let producer1: Producer = {
            id: 0,
            name: 'test producer',
            slug: 'test-producer',
            description: 'test description',
        }

        // get the producer id
        producer1 = await createProducer(producer1);
        // Append the producer id to the collections
        sampleCollections[0].producerId = producer1.id;
    }

    describe('Delete collections', () => {
        it('Should delete all collections', async () => {
            // Should delete all collection items first, since it has foregin key to `collection`
            await deleteCollItems();
            const promise = deleteCollections();

            // Verify no errors are thrown
            expect(promise).resolves.not.toThrow();

            // Verify no more collections by checking directly to DB
            const result = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
            const totalCollections = parseInt(result[0]?.count || '0', 10);
            expect(totalCollections).toBe(0);
        });
    });

    describe('Retrieve collections', () => {
        it('Should retrieve all collections', async () => {
            const result = await retrieve();
            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });

        it('Should match the number of existing collections in DB', async () => {
            const result = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
            const totalCollections = parseInt(result[0]?.count || '0', 10);
            const collections = await retrieve();
            expect(collections).toBeDefined();
            expect(collections.length).toBe(totalCollections);
        });
        it('Should retrieve collections with the correct properties', async () => {
            const collections = await retrieve();
            collections.forEach(collection => {
                expect(collection).toHaveProperty('id');
                expect(collection).toHaveProperty('name');
                expect(collection).toHaveProperty('slug');
                expect(collection).toHaveProperty('producerId');
                expect(collection).toHaveProperty('imageUrl');
                expect(collection).toHaveProperty('year');
                expect(collection).toHaveProperty('desc');
                expect(collection).toHaveProperty('itemsCount');
                expect(collection).toHaveProperty('createdAt');
            });
        });
    });

    describe('createCollection', () => {
        it('should add 1 more collection in DB', async () => {
            // Get the number of collections before adding a new one
            const resultBefore = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
            const totalCollectionsPrior = parseInt(resultBefore[0]?.count || '0', 10);

            // Add a new collection
            const newCollection = sampleCollections[0];
            await createCollection(newCollection);

            // Get the number of collections after adding a new one
            const resultAfter = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
            const totalCollectionsAfter = parseInt(resultAfter[0]?.count || '0', 10);

            expect(totalCollectionsAfter).toBe(totalCollectionsPrior + 1);
        });
        describe('add collection', () => {
            let totalCollectionsPrior = -1;
            beforeAll(async () => {
                // Get the number of collections before adding a new one
                const result = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
                totalCollectionsPrior = parseInt(result[0]?.count || '0', 10);

                // Add a new collection
                await createCollection(sampleCollections[0]);
            });
            it('should increase the number of collections by 1', async () => {
                // Get the number of collections after adding a new one
                const result = await sql`SELECT COUNT(*) FROM ${sql(tableName)}`;
                const totalCollectionsAfter = parseInt(result[0]?.count || '0', 10);

                expect(totalCollectionsAfter).toBe(totalCollectionsPrior + 1);
            });
        });
    });

    describe('Create coll and retrieve by keywords', () => {
        // Create a colection with a unique word in `slug`and `name`. It should be retrieveable by certain keyword
        // Note: Any queries of list of collection will not populate the items for performance reason
        let colls: Collection[];
        const uniqueSlug = 'slug-23456';
        const uniqueName = 'Name 23456';

        beforeAll(async () => {
            // Put unique word so the collection will be searchable
            const rawColl = {
                ...sampleCollections[0],
                slug: uniqueSlug,
                name: uniqueName,
            };

            // Save the collection
            const coll = await createCollection(rawColl);
        });
        it('Not searchable by not existing keyword', async () => {
            const colls = await retrieveByKeyword('not-existing-123');
            expect(colls).toHaveLength(0);
        });
        it('Searchable by keyword in `slug`', async () => {
            // Keyword: part of the `slug`
            const keyword = uniqueSlug.slice(1, uniqueSlug.length - 2);
            const colls = await retrieveByKeyword(keyword);
            expect(colls).toHaveLength(1);
            expect(colls[0].name).toBe(uniqueName);
        });
        it('Searchable by keyword in `name`', async () => {
            // Use part of `name` as keyword
            const keyword = uniqueName.slice(2, uniqueName.length - 2);
            const colls = await retrieveByKeyword(keyword);
            expect(colls).toHaveLength(1);
        });

    });

    describe('generateCollectionItemsByNumber', () => {
        let generatedItems: CollectionItem[];
        const collection: Collection = sampleCollections[0];

        beforeAll(() => {

            generatedItems = generateCollectionItemsByNumber(collection);
        });
        it('should generate the correct number of items', () => {
            expect(generatedItems).toHaveLength(collection.itemsCount);
        });
        it('Should have empty id', () => {
            generatedItems.forEach(item => {
                expect(item.id).toBe(0)
            });
        });
        it('should have the correct collection id', () => {
            generatedItems.forEach(item => {
                expect(item.collectionId).toBe(collection.id);
            });
        });
        it('should generate the correct order numbers', () => {
            generatedItems.forEach((item, index) => {
                expect(item.orderNumber).toBe(index + 1);
            });
        });
        it('should generate the correct item names', () => {
            generatedItems.forEach((item, i) => {
                expect(item.name).toBe(`${i + 1}`);
            });
        });
        it('should generate empty item description (for now)', () => {
            generatedItems.forEach((item) => {
                expect(item.description).toBe("");
            });
        });

        // This test will create a collection and then generate items for it
        describe('Save collection and generate items, then retrieve by the saved id', () => {
            // Total of collection items in DB before collection creation
            let collectionItemCountInDBPrior: number;
            // Items to be generated
            const totalCollectionItems = 3;
            // The collection is not yet saved, hence `id` is 0
            let savedCollectionId = 0;
            let retrievedCollection: Collection;

            beforeAll(async () => {
                // Count total collection items in DB
                collectionItemCountInDBPrior = parseInt((await sql`SELECT COUNT(*) FROM ${sql(collItemTableName)}`)[0]?.count || '0', 10);

                const c1 = sampleCollections[0];
                // Create number of items based of above variable
                c1.itemsCount = totalCollectionItems;
                const savedCollection: Collection = await createCollection(c1);
                savedCollectionId = savedCollection?.id || 0;

                // Retrieve the collection from the database
                const retrievalResult = await retrieveById(savedCollectionId);

                // Check if the collection was retrieved successfully
                // If not, throw an error
                if (!retrievalResult) {
                    throw new Error(`Collection with id ${savedCollectionId} not found`);
                }
                retrievedCollection = retrievalResult;
            });

            it('Should retrieve the collection', () => {
                expect(retrievedCollection).toBeDefined();
            });

            it('Should have id', () => {
                expect(retrievedCollection?.id).toBe(savedCollectionId);
            });

            it('Should have correct createdAt', () => {
                expect(retrievedCollection?.createdAt).toBeDefined();
                expect(retrievedCollection?.createdAt).toBeInstanceOf(Date);
            });

            it('Should match the slug', () => {
                expect(retrievedCollection?.slug).toBe(sampleCollections[0].slug);
            });

            it('Should match the name', () => {
                expect(retrievedCollection?.name).toBe(sampleCollections[0].name);
            });

            it('Should match the description', () => {
                expect(retrievedCollection?.description).toBe(sampleCollections[0].description);
            });

            it('Should match the producerId', () => {
                expect(retrievedCollection?.producerId).toBe(sampleCollections[0].producerId);
            });

            it('Has empty imageUrl', () => {
                expect(retrievedCollection?.imageUrl).toBe("");
            });

            it('Should match the year', () => {
                expect(retrievedCollection?.year).toBe(sampleCollections[0].year);
            });


            it('Has the correct `itemCount` attribute', () => {
                expect(retrievedCollection?.itemsCount).toBe(totalCollectionItems);
            });

            it('Has appended rows in DB collection items table', async () => {
                const result = await sql`SELECT COUNT(*) FROM ${sql(collItemTableName)}`;
                const collItemsCountInDbAfter = parseInt(result[0]?.count, 10) || 0;
                expect(collItemsCountInDbAfter).toBe(collectionItemCountInDBPrior + totalCollectionItems);
            });

            it('Has correct number of collectionItems', async () => {
                expect(retrievedCollection.items).toHaveLength(totalCollectionItems);
            });

            it('Each item has the correct collectionId', async () => {
                const items = await generateCollectionItemsByNumber(retrievedCollection);
                items.forEach(item => {
                    expect(item.collectionId).toBe(savedCollectionId);
                });
            });

            it('Each item has the correct orderNumber', async () => {
                const items = await generateCollectionItemsByNumber(retrievedCollection);
                items.forEach((item, index) => {
                    expect(item.orderNumber).toBe(index + 1);
                });
            });

            it('Each item name matches the orderNumber', async () => {
                const items = await generateCollectionItemsByNumber(retrievedCollection);
                items.forEach((item, index) => {
                    expect(item.name).toBe(`${index + 1}`);
                });
            });

            it('Each item has empty description', async () => {
                const items = await generateCollectionItemsByNumber(retrievedCollection);
                items.forEach(item => {
                    expect(item.description).toBe("");
                });
            });
        });
    });
    afterAll(async () => {
        // For now, do ot delete test rows
        // deleteTestRows();

        // Close SQL connection
        await closeSqlConnection();
    });

    async function deleteTestRows() {
        // Collect list of producer id to delete
        let producerIdsToDelete: number[] = sampleCollections.reduce<number[]>((acc, collection) => {
            if (collection.producerId) {
                acc.push(Number(collection.producerId));
                // acc.push(collection.producerId);
            }
            return acc;
        }, []);

        // Delete all collections that has `producerId` in `producerIdsToDelete`
        // To ignore error message from VSCode. VSCode does not understand that 'string' still can be passed even though the signature only accept `number|undefined` as the second parameter
        // @ts-ignore
        await sql`
    DELETE FROM ${sql(tableName)}
    WHERE "producer_id" IN ${sql(producerIdsToDelete)}
`;

        // Delete producer based on the list of id in the `sampleCollections`
        // To ignore error message from VSCode. VSCode does not understand that 'string' still can be passed even though the signature only accept `number|undefined` as the second parameter
        // @ts-ignore
        await sql`DELETE FROM ${sql(producerTableName)} WHERE id IN ${sql(producerIdsToDelete)}`;
    }
});