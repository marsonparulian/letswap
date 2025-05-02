// This file contains invalid / failed tests for the `createCollectionAction` function.
import * as collActions from "@/app/lib/actions/collection-actions";
import * as texts from "@/app/lib/texts/texts";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Mock revalidatePath, to avoid error in test
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));
// Mock next/navigation, to make sure no redirection happens
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("createCollectionAction --create-invalid", () => {
  const formData = new FormData();
  let formState: collActions.CollFormState;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Make sure the `redirect` mock is still available with clear history
    if (!redirect && typeof redirect !== "function") {
      throw new Error(
        "Redirect mock is not available or not a function in test file"
      );
    }
    // Make sure the `redirect` has not been called after each test
    expect(redirect).not.toHaveBeenCalled();
  });

  describe("Create coll with empty form", () => {
    beforeAll(async () => {
      const initialState: collActions.CollFormState = {
        errors: {},
        message: null,
      };
      formState = await collActions.createCollectionAction(
        initialState,
        formData
      );
    });
    it("Error message for empty producerId", () => {
      expect(formState.errors.producerId).toBeDefined();
      expect(formState.errors.producerId).toContain(
        texts.fieldIsRequired("Producer")
      );
    });

    it("Error message for empty slug", () => {
      expect(formState.errors.slug).toBeDefined();
      expect(formState.errors.slug).toContain(texts.fieldIsRequired("Slug"));
    });

    it("Error message for empty name", () => {
      expect(formState.errors.name).toBeDefined();
      expect(formState.errors.name).toContain(texts.fieldIsRequired("Name"));
    });

    it("Error message for empty description", () => {
      expect(formState.errors.description).toBeDefined();
      expect(formState.errors.description).toContain(
        texts.fieldIsRequired("Description")
      );
    });

    it("Error message for empty itemsCount", () => {
      expect(formState.errors.itemsCount).toBeDefined();
      expect(formState.errors.itemsCount).toContain(
        texts.fieldMinLength("Items", 2)
      );
    });

    it("Error message for empty year", () => {
      expect(formState.errors.year).toBeDefined();
      expect(formState.errors.year).toContain(
        texts.fieldMinValue("Year", 2010)
      );
    });

    it("No error message for empty imageUrl", () => {
      expect(formState.errors.imageUrl).toBeUndefined();
    });
  });
});
