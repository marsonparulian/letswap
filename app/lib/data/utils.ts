//Contains utilities related to DB operations
import postgres from "postgres";

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

/**
 * Check if a slug is unique in a given table
 * @param slug - The slug to check for uniqueness
 * @param tableName - The name of the table to check
 * @returns Promise<boolean> - true if the slug is unique, false otherwise
 */
export async function checkSlugUniqueness(
  slug: string,
  tableName: string
): Promise<boolean> {
  try {
    const result = await sql`SELECT COUNT(*) FROM ${sql(
      tableName
    )} WHERE slug = ${slug}`;
    const count = Number(result[0].count);
    return count === 0;
  } catch (error) {
    console.error(
      `Error checking slug uniqueness in table ${tableName}:`,
      error
    );
    throw new Error(`Failed to check slug uniqueness in table ${tableName}`);
  }
}
