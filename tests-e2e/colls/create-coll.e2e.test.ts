/**
 * @jest-environment node
*/
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)

describe('Create coll on web form', () => {
    it('This function should be executed', () => {
        expect(true).toBe(true);
    });
});