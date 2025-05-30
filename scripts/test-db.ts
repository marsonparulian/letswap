import { config } from "dotenv";
import { join } from "path";
import { prisma } from "../app/lib/prisma";
import { computeFromManifest } from "next/dist/build/utils";

// Load .env file from project root
config({ path: join(__dirname, "..", ".env") });

async function main() {
  console.log("Starting database connection test...");

  try {
    console.log("Environment check:");
    console.log("NODE_ENV:", process.env.NODE_ENV);

    const dbUrl = process.env.DATABASE_URL || "Not set";
    const postgresUrl = process.env.POSTGRES_URL || "Not set";

    console.log("\nDatabase URLs:");
    console.log(
      "DATABASE_URL:",
      dbUrl.replace(/\/\/.*@/, "//[CREDENTIALS_HIDDEN]@")
    );
    console.log(
      "POSTGRES_URL:",
      postgresUrl.replace(/\/\/.*@/, "//[CREDENTIALS_HIDDEN]@")
    );

    if (dbUrl === "Not set" && postgresUrl === "Not set") {
      console.error("\n❌ Error: Neither DATABASE_URL nor POSTGRES_URL is set");
      process.exit(1);
    }

    console.log("\nChecking database connection details...");
    const connectionInfo = await prisma.$queryRaw`
      SELECT inet_server_addr() as server_ip, 
             current_database() as database,
             version() as version`;
    console.log("Connection details:", connectionInfo);

    // Check if we're connected to localhost
    const serverIp = (connectionInfo as any)[0].server_ip;
    if (serverIp === "127.0.0.1" || serverIp === "localhost") {
      console.warn("\n⚠️  WARNING: Connected to localhost database");
      console.warn("Make sure DATABASE_URL is set to your Neon database URL");
    }

    console.log("\nAttempting table query...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);

    console.log("\nDatabase connection test completed successfully");
  } catch (error) {
    console.error("\nDatabase connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from database");
  }
}

main();
