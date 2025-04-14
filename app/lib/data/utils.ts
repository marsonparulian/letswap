//Contains utilities related to DB operations
import postgres from 'postgres';

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const closeSqlConnection = async () => {
    await sql.end({ timeout: 5 });
};

/**
 * Convert DB table object to TS object : 
 * all snake_case attributes to pascalCase type attributes
 */
export function tableToObject<T>(p1: CamelToSnake<T>): T {
    const result: Partial<T> = {};
    for (const key in p1) {
        const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        result[camelKey as keyof T] = p1[key] as unknown as T[keyof T];
    }
    return result as T;
}
