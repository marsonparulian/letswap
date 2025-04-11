//Contains utilities related to DB operations
import postgres from 'postgres';

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const closeSqlConnection = async () => {
    await sql.end({ timeout: 5 });
};

/**
 * Convert a string from snake_case to camelCase
 */
const snakeToCamelString = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
/**
 * Will convert any attributes from snake_case to camelCase
 */
export const snakeToCamelObject = () => {
    return (obj: Record<string, any>) => {
        const newObj: Record<string, any> = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = snakeToCamelString(key);
                newObj[camelKey] = obj[key];
            }
        }
        return newObj;
    };
}
/**
 * Convert all keys in an array of objects from snake_case to camelCase
 */
export const snakeToCamelArrayObject = (arr: Record<string, any>[]) => {
    return arr.map(obj => snakeToCamelObject()(obj));
};
