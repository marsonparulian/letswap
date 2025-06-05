/**
 * This file is meant to push db schema based on `schema.prisma`.
 * First, this load  some .env files, then execute `npx prisma db push`
 */

const { config } = require("dotenv");
const { existsSync } = require("fs");
const { execSync } = require("child_process");
const path = require("path");

// Load env files in order: .env, .env.development, .env.local
const envFiles = [".env", ".env.development", ".env.local"];

envFiles.forEach((file) => {
  const fullPath = path.resolve(process.cwd(), file);
  if (existsSync(fullPath)) {
    config({ path: fullPath, override: true });
    console.log(`${file} is loaded..`);
  }
});

try {
  execSync("npx prisma db push", { stdio: "inherit" });
} catch (err) {
  console.error("Prisma push failed:", err.message);
  process.exit(1);
}
