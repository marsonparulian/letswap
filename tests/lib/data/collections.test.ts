/**
 * @jest-environment node
 */
// Note: set `testEnvironment` to `node`, because this test DB related functions
// About: this file test the `Collection` data layer
import { tableName, deleteCollections } from '@/app/lib/data/collections';

describe('lib/data/collections', () => {
    it('should have the correct table name', () => {
        expect(tableName).toBe('collections');
    });
    describe('Delete collections', () => {
        it('Should delete all collections', async () => {
            await deleteCollections();
            // No need to check the returned value.The delete function should throw any errors.

            // Verify no more collections in DB
            // const collections = await retrieve();
            //             expect(collections).toHaveLength(0);
        });
    });
    //     describe('Retrieve collections', () => {
    //         // Note: We do not need to test to retrieve all, since it is already tested after deletion and creation tests.

    //         it.todo('Should retrieve by name');
    //     });
    //     describe('createCollection', () => {
    //         it('should create a collection successfully', async () => {

    //         });
    //     });
    //     describe('generateCollectionItemsByNumber', () => {
    //         let generatedItems: CollectionItem[];
    //         const collection: Collection = {
    //             id: "1",
    //             name: 'test collection',
    //             slug: 'test-collection',
    //             producerId: "4",
    //             imageUrl: "",
    //             year: 2021,
    //             desc: 'test description',
    //             items_count: 0,
    //             created_at: new Date(),
    //         }

    //         beforeAll(() => {
    //             generatedItems = generateCollectionItemsByNumber(collection, 3);
    //         });
    //         it('should generate the correct number of items', () => {
    //             expect(generatedItems).toHaveLength(3);
    //         });
    //         it('Should have empty id', () => {
    //             generatedItems.forEach(item => {
    //                 expect(item.id).toBe("");
    //             });
    //         });
    //         it('should have the correct collection id', () => {
    //             generatedItems.forEach(item => {
    //                 expect(item.collectionId).toBe(collection.id);
    //             });
    //         });
    //         it('should generate the correct order numbers', () => {
    //             generatedItems.forEach((item, index) => {
    //                 expect(item.orderNumber).toBe(index + 1);
    //             });
    //         });
    //         it('should generate the correct item names', () => {
    //             generatedItems.forEach((item, i) => {
    //                 expect(item.name).toBe(`${i + 1}`);
    //             });
    //         });
    //         it('should generate empty item description (for noew)', () => {
    //             generatedItems.forEach((item) => {
    //                 expect(item.desc).toBe("");
    //             });
    //         });
    //     });
});