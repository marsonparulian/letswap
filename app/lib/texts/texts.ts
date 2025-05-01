// This file contains user-facing texts, such as error messages. So they can be used both for app and tests

// Message when a field is required
export function fieldIsRequired(field: string): string {
  return `${field} is required`;
}
