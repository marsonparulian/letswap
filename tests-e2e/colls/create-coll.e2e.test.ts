/**
 * @jest-environment node
 */
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)

describe("Create coll on web form", () => {
  beforeAll(async () => {
    // Launch puppeteer browser
  });

  it("Visit collection/create URL& verify all elements", async () => {
    // Visit URL, and wait for navigation
    // Verify all elements
  });
  it.todo("Fill the form");
  it.todo("Click submit and wait");
  it.todo("Redirected to the list page");
  it.todo("Found on the list");
});
