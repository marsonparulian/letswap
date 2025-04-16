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

  beforeAll(async () => {
    // Launch browser
    const userDataDir = "/home/mpa/projects/letswap/tests-e2e/user-data";
    browser = await puppeteer.launch({ headless: true, userDataDir });
  });
  describe("Submit empty form", () => {
    beforeAll(async () => {
      // New page
      page = await browser.newPage();
      // Navigate to the form
      // Wait for navigation to finish
    });
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
      console.log("Invalid slug");
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
});
