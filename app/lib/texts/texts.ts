// This file contains user-facing texts, such as error messages. So they can be used both for app and tests

// Message when a field is required
export function fieldIsRequired(field: string): string {
  return `${field} is required`;
}

// Message when a field characters not meet the minimum
export function fieldMinLength(field: string, min: number): string {
  return `${field} must be at least ${min} characters`;
}

// Message when a field characters not meet the maximum
export function fieldMaxLength(field: string, max: number): string {
  return `${field} must be at most ${max} characters`;
}

// Message when a field chracters not in between min and max
export function fieldLength(field: string, min: number, max: number): string {
  return `${field} must be between ${min} and ${max} characters`;
}
// Message when number of field does not meet the minium value
export function fieldMinValue(field: string, min: number): string {
  return `${field} must be at least ${min}`;
}
// Message when number of field does not meet the maximum value
export function fieldMaxValue(field: string, max: number): string {
  return `${field} must be at most ${max}`;
}
