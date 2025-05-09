import type { Config } from "jest";
import { babelIncludeRegexes } from "next/dist/build/webpack-config";
import nextJest from "next/jest.js";
import { fileURLToPath } from "url";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  //   testEnvironment: "jsdom",
  testEnvironment: "node",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@/app": ["./app"],
    // "@/*": ["./*"]
  },
  // Increase default timeout, in case need to manually wait for some async operations
  testTimeout: 48e3,
  // reporters: ["default"],
  testMatch: ["<rootDir>/tests/e2e/**/*.(spec|test).[jt]s?(x)"],
  bail: true,
  // IMPORTANT: do not use `watch` in this config file, put it in the command line. Otherwise it will cause "Error: AggregatedResult must be present after test run is complete"
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
