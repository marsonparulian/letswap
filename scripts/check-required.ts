/**
 * This file checks all the requirements, both from dev and prod
 */

import * as dotenv from "dotenv";
import { resolve } from "path";
const fs = require("fs");

// Check the enviroment, dev or prod ?
const isDevelopment = process.env.NODE_ENV !== "production";
console.log(
  `Checking prerequisites.. currently in ${
    isDevelopment ? "development" : "production"
  } mode`
);

// Set up list of .env files to load
let envFiles = [".env", ".env.local"];
let specificEnvFile = ".env.production";
if (isDevelopment) {
  specificEnvFile = ".env.development";
}
envFiles.push(specificEnvFile);

// Check if the specific environment file exists
const specificEnvPath = resolve(process.cwd(), specificEnvFile);
if (!fs.existsSync(specificEnvPath)) {
  console.error(`Error: ${specificEnvFile} not found at ${specificEnvPath}`);
  process.exit(1);
}

// Load all environment files
envFiles.forEach((file) => {
  dotenv.config({
    path: resolve(process.cwd(), file),
  });
});

// Need for full qualified domain name. Example :"http://localhost:3000" # Or whatever port your app runs on
// Check for NEXTAUTH_URL
if (!process.env.NEXTAUTH_URL) {
  console.error(
    "Error: NEXTAUTH_URL is not set in environment. It has to be full qualified domain including port number."
  );
  process.exit(1);
}

// Checking is complete
console.log(
  `Prerequisites is complete: ${
    isDevelopment ? "development" : "production"
  } mode`
);
console.log(" ");
