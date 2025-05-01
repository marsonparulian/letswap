// This file contains tests for non-DB related collection actions
import * as collActions from "@/app/lib/actions/collection-actions";

describe("Tests for non-DB collection actions", () => {
  describe("parseFormData", () => {
    it("Should parse all fields from FormData", () => {
      const formData = new FormData();
      formData.append("id", "1");
      formData.append("slug", "test-slug");
      formData.append("name", "Test Collection");
      formData.append("description", "Test description");
      formData.append("itemsCount", "10");
      formData.append("producerId", "2");
      formData.append("imageUrl", "http://example.com/image.jpg");
      formData.append("year", "2023");

      const parsedData = collActions.parseFormData(formData);

      expect(parsedData).toEqual({
        id: "1",
        slug: "test-slug",
        name: "Test Collection",
        description: "Test description",
        itemsCount: "10",
        producerId: "2",
        imageUrl: "http://example.com/image.jpg",
        year: "2023",
      });
    });
  });
});
