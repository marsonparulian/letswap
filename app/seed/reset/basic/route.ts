/**
 * This file will:
 * - Delete all data from all tables
 * - Insert 2 producers: Coles and Woolworths
 */
import { tableName as producerTableName } from "@/app/lib/data/producers";
import { tableName as collectionTableName } from "@/app/lib/data/collections";
import { tableName as collectionItemsTableName } from "@/app/lib/data/collection_items";
import { sql } from "@/app/lib/data/utils";

async function deleteAllData() {
  // Delete in reverse order of dependencies
  await sql`DELETE FROM ${sql(collectionItemsTableName)};`;
  await sql`DELETE FROM ${sql(collectionTableName)};`;
  await sql`DELETE FROM ${sql(producerTableName)};`;
}

async function seedBasicProducers() {
  // Insert the two main producers
  await sql`
        INSERT INTO ${sql(producerTableName)} (slug, name, description)
        VALUES 
            ('coles', 'Coles', 'Coles Supermarket'),
            ('woolworths', 'Woolworths', 'Woolworths Supermarket')
        RETURNING *
    `;
}

export async function GET() {
  try {
    // Run all operations in a transaction
    await sql.begin(async (sql) => {
      await deleteAllData();
      await seedBasicProducers();
    });

    return Response.json({
      message: "Database reset and seeded with basic data",
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return Response.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
