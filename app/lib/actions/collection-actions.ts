// Contain actions for collection
"use server";

import z from "zod";

export type RawCollFormData = {
  id: FormDataEntryValue | null;
  slug: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  itemsCount: FormDataEntryValue | null;
  producerId: FormDataEntryValue | null;
  imageUrl: FormDataEntryValue | null;
  year: FormDataEntryValue | null;
};
// Type to display form errors for each attributes of `RawCollFormData`
export type CollFormState = {
  [k in keyof RawCollFormData]: string[] | undefined;
};

// Parse `FormData` to acquire `RawCollFormData`
export function parseFormData(formData: FormData): RawCollFormData {
  const rawCollFormData = {
    id: formData.get("id"),
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    itemsCount: formData.get("itemsCount"),
    producerId: formData.get("producerId"),
    imageUrl: formData.get("imageUrl"),
    year: formData.get("year"),
  };

  return rawCollFormData;
}
