// Contain actions for collection
"use server";

import { createCollection } from "@/app/lib/data/collections";
import z from "zod";
import * as texts from "@/app/lib/texts/texts";
import { revalidatePath } from "next/cache";

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
  errors: {
    [k in keyof RawCollFormData]?: string[] | undefined;
  };
  message: string | null;
  success?: boolean;
};

// Parse `FormData` to acquire `RawCollFormData`
export async function parseFormData(
  formData: FormData
): Promise<RawCollFormData> {
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

const CollSchema = z.object({
  id: z.coerce.number(),
  producerId: z.coerce.number().min(1, texts.fieldIsRequired("Producer")),
  slug: z
    .string({
      invalid_type_error: texts.fieldIsRequired("Slug"),
    })
    .nonempty(texts.fieldIsRequired("Slug"))
    .min(3, texts.fieldMinLength("Slug", 3))
    .max(500, texts.fieldMaxLength("Slug", 500)),
  name: z
    .string({
      invalid_type_error: texts.fieldIsRequired("Name"),
    })
    .nonempty(texts.fieldIsRequired("Name"))
    .min(3, texts.fieldMinLength("Name", 3))
    .max(500, texts.fieldMaxLength("Name", 500)),
  description: z
    .string({
      invalid_type_error: texts.fieldIsRequired("Description"),
    })
    .min(3, texts.fieldMinLength("Description", 3))
    .max(5000, texts.fieldMaxLength("Description", 5000)),
  itemsCount: z.coerce
    .number()
    .min(2, texts.fieldMinValue("Items", 2))
    .max(300, texts.fieldMaxValue("Items", 300)),
  year: z.coerce
    .number()
    .min(2010, texts.fieldMinValue("Year", 2010))
    .max(2100, texts.fieldMaxValue("Year", 2100)),
  imageUrl: z.string().nullable().optional(),
});

export async function createCollectionAction(
  prevState: CollFormState,
  formData: FormData
): Promise<CollFormState> {
  const validatedData = CollSchema.omit({
    id: true,
  }).safeParse(await parseFormData(formData));

  // Check for invalid
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Failed saving collection",
    };
  }

  // Continue with valid data.
  // Saving new collection
  try {
    createCollection({
      id: 0,
      createdAt: new Date(),
      items: [],
      ...validatedData.data,
      // Overwrite the type of `imageUrl`, because currently `imageUrl` is nulable and optional
      imageUrl: validatedData.data.imageUrl || "",
    });
  } catch (e) {
    console.error("Error: Failed saving collection. Problem with DB data lib");
    console.error(e);
    return {
      errors: {},
      message: "Failed saving Collection data",
    };
  }

  // All good! response with `success` status
  // Revalidate path to refresh data
  revalidatePath("/collections/");
  // Set `success` and the client will redirect
  return {
    errors: {},
    message: texts.savedSuccessfully("Collection"),
    success: true,
  };
}
