/**
 * @jest-environment node
*/
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)
// Description: Test for the producers data layer


import { tableName, deleteProducer } from '@/app/lib/data/producers';

describe('lib/data/producers', () => {
    it('Should have the correct table name', () => {
        expect(tableName).toBe('producers');
    });
    describe('Delete producers', () => {

        it('Should not throw error when delete by id = 1', async () => {
            const id = '1';
            const result = await deleteProducer(id);
            // This test only to make sure no errors are thrown. 
            // No need to check on the result, since probably id=1 not exist in DB. 
        })
    });
});