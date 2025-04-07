//Contains utilities related to DB operations
import postgres from 'postgres';

export const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const closeSqlConnection = async () => {
    await sql.end({ timeout: 5 });
};
