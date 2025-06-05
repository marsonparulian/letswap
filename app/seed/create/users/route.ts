// Purpose : Create users table.
import { tableName } from '@/app/lib/data/users';
import { sql } from '@/app/lib/data/utils';

async function createUsers() {
    // Check if the table already exists
    await sql`DROP TABLE IF EXISTS ${sql(tableName)};`;
    // Create the table
    return sql`
        CREATE TABLE IF NOT EXISTS ${sql(tableName)} (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            email_verified TIMESTAMP,
            image TEXT,
            slug TEXT UNIQUE,
            is_profile_complete BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
}

async function createAccounts() {
    // Check if the table already exists
    await sql`DROP TABLE IF EXISTS accounts;`;
    // Create the table
    return sql`
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES ${sql(tableName)}(id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            provider TEXT NOT NULL,
            provider_account_id TEXT NOT NULL,
            refresh_token TEXT,
            access_token TEXT,
            expires_at INTEGER,
            token_type TEXT,
            scope TEXT,
            id_token TEXT,
            session_state TEXT,
            UNIQUE(provider, provider_account_id)
        );
    `;
}

export async function GET() {
    try {
        await sql.begin(() => [
            createUsers(),
            createAccounts()
        ]);

        return Response.json({ message: `Tables ${tableName} and accounts have been created` });
    } catch (error) {
        console.log('error creating tables');
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}
