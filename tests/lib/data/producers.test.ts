// Description: Test for the producers data layer

import { deleteProducer } from '@/app/lib/data/producers';

describe('lib/data/producers', () => {
    describe('Delete producers', () => {
        it('Should delete by id', async () => {
            const id = '1';
            const result = await deleteProducer(id);
            expect(result).toBe(true);
        })
    });
});