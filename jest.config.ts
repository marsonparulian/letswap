import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@/app": ["./app"],
    // "@/*": ["./*"]
  },
  // Increase default timeout, in case need to manually wait for some async operations
  testTimeout: 48000,
  // Set tests directory to `./tests`
  testMatch: [
    "<rootDir>/tests/unit/**/*.(spec|test).[jt]s?(x)",
    "<rootDir>/tests/integration/**/*.(spec|test).[jt]s?(x)",
    "<rootDir>/tests/functional/**/*.(spec|test).[jt]s?(x)",
  ],
  bail: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
