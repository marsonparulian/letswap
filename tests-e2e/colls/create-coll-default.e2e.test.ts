/**
 * @jest-environment node
 */
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)

import { Browser, Page } from "puppeteer";
import * as utils from "@/tests-e2e/utils";

// This file test the default of collection form
describe("Test the default of coll form", () => {
  let browser: Browser;
  let page: Page;
  beforeAll(async () => {
    browser = await utils.launchBrowser();
    // page = await browser.newPage();
  });

  afterAll(async () => {
    browser.close();
  });

  it.todo("Form #coll-form exist");
  it.todo('Form has h1 "Collection Form"');
  it.todo("Component to select producers");
  it.todo("None of the producers is selected");
  it.todo("Number of producers same as in DB");
  it.todo("Slug input text");
  it.todo("Slug input is empty");
  it.todo("Name input text");
  it.todo("Name input is empty");
  it.todo("Description textarea input");
  it.todo("Description textarea is empty");
  it.todo("Submit button exist");
});
