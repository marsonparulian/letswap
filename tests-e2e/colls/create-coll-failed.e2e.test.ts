/**
 * @jest-environment node
 */
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)

import puppeteer, { Browser, Page } from "puppeteer";

// Scenario: Invalid result when creating `collection`

describe("Invalid collection form", () => {
  // Reff to puppeteer `browser` object
  let browser: Browser;
  // Reff to `Page` object that will be created in every `describe`
  let page: Page;
  // URL of the form to create new collection
  const formUrl = "http://localhost:3000/collections/create";

  beforeAll(async () => {
    // Launch browser
    const userDataDir = "/home/mpa/projects/letswap/tests-e2e/user-data";
    browser = await puppeteer.launch({ headless: false, userDataDir });
  });
  describe("Submit defaut form", () => {
    beforeAll(async () => {
      // New page
      page = await browser.newPage();
    });
    it("Status 200 & form element is parsed", async () => {
      // Navigate to the form & wait
      const response = await page.goto(formUrl);

      expect(response?.status()).toBe(200);
      expect(response?.url()).toContain("/collections/create");

      // Assert there is only 1 form element
      const formCount: number = await page.$$eval(
        "form#coll-form",
        (elements: HTMLElement[]) => elements.length
      );
      expect(formCount).toBe(1);
    }, 82e6);
    it.todo("Verifiy the form elements");
    it.todo("Verify no error messages");
    it.todo("Submit all empty form");
    it.todo("Check all the error messages");
  });
  describe("Submit invalid name", () => {
    beforeAll(async () => {
      // Open new page
      // Navigate to the form
    });
    it.todo("Name input is empty & no error message");
    it.todo("Error message after submit too few characters");
  });
  describe("Submit invalid slug", () => {
    beforeAll(async () => {
      // Open new page & navigate to the form
    });

    it.todo("Verified empty slug input");
    it.todo("Got error message after submit too few character");
    it.todo("Error msg gone after resubmit with valid slug input");
    it.todo("Got error message after submit taken `slug`");
    it.todo("Error message gone after submit valid input.Form resubmit failed");
  });
  describe("Submit invalid `itemsCount`", () => {
    beforeAll(async () => {
      // New page & navigate to the form
    });

    it.todo("Empty `itemsCount` input & no error message");
    it.todo("Got error message after submit too small `itemsCount`");
    it.todo("No error message after submit valid `itemsCount`");
    it.todo("Got error message after submit to large `itemsCount`");
    it.todo("Got error after submit letter");
  });
  describe("Submit invalid `description`", () => {
    beforeAll(async () => {
      // New page & navigate to the form
    });
    it.todo("No error msg & empty description.");
    it.todo("Got error msg for empty description");
    it.todo("Got error msg after too few description");
    it.todo("Error message gone after valid description");
  });
  describe("Submit invalid producer", () => {
    beforeAll(async () => {
      // new page & navigate to the form
    });

    it.todo("No error msg & empty producer dropdown box");
    it.todo("Got error msg after not select any provider");
    it.todo("Error message gone after resubmit with selected provider");
  });
  afterAll(async () => {
    await browser.close();
  });
});
