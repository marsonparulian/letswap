import {
  sql,
  checkSlugUniqueness,
  closeSqlConnection,
} from "@/app/lib/data/utils";

describe("checkSlugUniqueness Integration Tests", () => {
  const TEST_TABLE = "test_slugs";

  beforeAll(async () => {
    // Create a test table
    await sql`
      CREATE TABLE IF NOT EXISTS ${sql(TEST_TABLE)} (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL
      )
    `;
  });

  beforeEach(async () => {
    // Clear the test table before each test
    await sql`DELETE FROM ${sql(TEST_TABLE)}`;
  });

  afterAll(async () => {
    // Drop the test table and close connection
    await sql`DROP TABLE IF EXISTS ${sql(TEST_TABLE)}`;
    await closeSqlConnection();
  });

  it("should return true for a new unique slug", async () => {
    const result = await checkSlugUniqueness(TEST_TABLE, "unique-test-slug");
    expect(result).toBe(true);
  });

  it("should return false for an existing slug", async () => {
    // Insert a test slug
    await sql`
      INSERT INTO ${sql(TEST_TABLE)} (slug)
      VALUES (${"existing-slug"})
    `;

    const result = await checkSlugUniqueness(TEST_TABLE, "existing-slug");
    expect(result).toBe(false);
  });

  it("should handle special characters in slugs", async () => {
    const specialSlug = "test-slug-123_456";
    await sql`
      INSERT INTO ${sql(TEST_TABLE)} (slug)
      VALUES (${specialSlug})
    `;

    const result = await checkSlugUniqueness(TEST_TABLE, specialSlug);
    expect(result).toBe(false);
  });

  it("should handle concurrent checks correctly", async () => {
    // Test concurrent uniqueness checks
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const slug = `concurrent-slug-${i}`;
      promises.push(checkSlugUniqueness(TEST_TABLE, slug));
    }

    const results = await Promise.all(promises);
    expect(results.every((result) => result === true)).toBe(true);
  });

  it("should throw error for non-existent table", async () => {
    await expect(
      checkSlugUniqueness("non_existent_table", "test-slug")
    ).rejects.toThrow();
  });
});
