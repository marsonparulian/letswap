import { tableToObject } from '@/app/lib/data/utils';
import { camel } from 'postgres';

describe('@/app/lib/data/utils.ts', () => {
    describe('Map snake_case attributes to camelCase', () => {
        const snakeCased = {
            id: 4,
            name: "name",
            producer_id: "Good Producer",
            description: "This is description",
            created_at: "2024-04-9",
        };
        let camelCased: { [key: string]: any };
        beforeAll(() => {
            // Map 
            camelCased = tableToObject(snakeCased);
        });
        it('Should not have `producer_id` attribute', () => {
            expect(camelCased).not.toHaveProperty('producer_id');
        });

        it('Should have `producerId` attribute', () => {
            expect(camelCased).toHaveProperty('producerId', 'Good Producer');
        });

        it('Should have the correct value for producerId', () => {
            expect(camelCased?.producerId).toBe(snakeCased.producer_id);
        });

        it('Should not have `created_at` attribute', () => {
            expect(camelCased).not.toHaveProperty('created_at');
        });

        it('Should have `createdAt` attribute', () => {
            expect(camelCased).toHaveProperty('createdAt', '2024-04-9');
        });

        it('Should have the correct value for createdAt', () => {
            expect(camelCased?.createdAt).toBe(snakeCased.created_at);
        });
    })
})