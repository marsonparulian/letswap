/**
 * Validates that an environment variable exists and is not empty
 * @param name The name of the environment variable to validate
 * @returns The value of the environment variable
 * @throws Error if the environment variable is not set or empty
 */
export function validateRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Required environment variable ${name} is not set or empty`
    );
  }
  return value;
}
