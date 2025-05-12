import { RawCollFormData } from "@/app/lib/actions/collection-actions";
import { mockUtils } from "./mock-utils";

// Mock data to create collection
export const validUnsavedCollectionFormData = (): FormData => {
  const tag = mockUtils.generateTag("collection");
  const formData = new FormData();
  // formData.append("id", "");
  formData.append("slug", `unsaved-collection-${tag}`);
  formData.append("name", `unsaved Collection ${tag}`);
  formData.append("description", "This is a test collection description");
  formData.append("itemsCount", "3");
  formData.append("producerId", "2");
  // formData.append("imageUrl", "");
  formData.append("year", "2026");
  return formData;
};

// Mock of a saved collection
export const validCollectionFormData = (): FormData => {
  const tag = mockUtils.generateTag("collection");
  const formData = new FormData();
  formData.append("id", "1");
  formData.append("slug", `test-collection-${tag}`);
  formData.append("name", `Test Collection ${tag}`);
  formData.append("description", "This is a test collection description");
  formData.append("itemsCount", "10");
  formData.append("producerId", "1");
  formData.append("imageUrl", "https://example.com/image.jpg");
  formData.append("year", "2023");
  return formData;
};

// Mock of an empty collection for data
export const emptyCollectionFormData = (): FormData => {
  const formData = new FormData();
  formData.append("id", "");
  formData.append("slug", "");
  formData.append("name", "");
  formData.append("description", "");
  formData.append("itemsCount", "");
  formData.append("producerId", "");
  formData.append("imageUrl", "");
  formData.append("year", "");
  return formData;
};

// Mock of a collection with invalid data
export const invalidCollectionFormData = (): FormData => {
  const formData = new FormData();
  formData.append("id", "invalid");
  formData.append("slug", "a"); // too short
  formData.append("name", "ab"); // too short
  formData.append("description", "ab"); // too short
  formData.append("itemsCount", "1"); // below min
  formData.append("producerId", "0"); // below min
  formData.append("imageUrl", "invalid-url");
  formData.append("year", "2000"); // below min
  return formData;
};
