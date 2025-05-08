/**
 * @jest-environment node
 */
// Note: directive above is needed to override the global `jsdom`, since this file tests server functions (DB related)

import { Browser, Page } from "puppeteer";
import * as utils from "@/tests-e2e/utils";
import * as producersData from "@/app/lib/data/producers";
import { closeSqlConnection } from "@/app/lib/data/utils";

// This file test the default of collection form
describe("Test the default of coll form", () => {
  let browser: Browser;
  let page: Page;
  beforeAll(async () => {
    browser = await utils.launchBrowser();
    page = await browser.newPage();
    await page.goto(utils.URL_COLL_CREATE);
  });

  afterAll(async () => {
    browser.close();
  });

  it("Form #coll-form exist", async () => {
    // await page.waitForSelector("#coll-form");
    const form = await page.$("#coll-form");
    expect(form).not.toBeNull();
  });
  it('Form has h1 "Collection Form"', async () => {
    const h1 = await page.$eval("#coll-form h1", (el) => el.textContent);
    expect(h1).toBe("Collection Form");
  });
  it("The text 'Form' in the <H1> has .show-for-sr class", async () => {
    const formText = await page.$eval(
      "#coll-form h1 .show-for-sr",
      (el) => el.textContent
    );
    expect(formText).toBe("Form");
  });
  it("select[name='producerId'] to select producers", async () => {
    const selectExists = await page.$("select[name='producerId']");
    expect(selectExists).not.toBeNull();
  });

  it("None of the producers is selected", async () => {
    const selectedOption = await page.$eval(
      "select[name='producerId']",
      (select) => (select as HTMLSelectElement).value
    );
    expect(selectedOption).toBe("");
  });
  it("Producers are the same as in DB", async () => {
    // Retrieve producers from DB and close the connection
    const producersFromDB = await producersData.getProducers();
    await closeSqlConnection();

    const optionValues = await page.$$eval(
      "select[name='producerId'] option",
      (options) => options.map((option) => parseInt(option.value))
    );
    const optionTexts = await page.$$eval(
      "select[name='producerId'] option",
      (options) => options.map((option) => option.textContent)
    );
    expect(optionValues.length).toBe(producersFromDB.length + 1); // +1 for the empty option
    // Check if all producers from DB are present in the select options
    producersFromDB.forEach((producer) => {
      expect(optionValues).toContain(producer.id);
      expect(optionTexts).toContain(producer.name);
    });
  });

  it("Slug input text", async () => {
    const slugInput = await page.$("input[name='slug']");
    expect(slugInput).not.toBeNull();
  });

  it("Slug input is empty", async () => {
    const slugValue = await page.$eval(
      "input[name='slug']",
      (input) => (input as HTMLInputElement).value
    );
    expect(slugValue).toBe("");
  });
  it("input[name='name'] exists", async () => {
    const nameInput = await page.$("input[name='name']");
    expect(nameInput).not.toBeNull();
  });

  it("input[name='name'] is empty", async () => {
    const nameValue = await page.$eval(
      "input[name='name']",
      (input) => (input as HTMLInputElement).value
    );
    expect(nameValue).toBe("");
  });
  it("[name='itemsCount'] is exists", async () => {
    const numberItemsInput = await page.$("input[name='itemsCount']");
    expect(numberItemsInput).not.toBeNull();
  });

  it("itemsCount input is empty", async () => {
    const numberItemsValue = await page.$eval(
      "input[name='itemsCount']",
      (input) => (input as HTMLInputElement).value
    );
    expect(numberItemsValue).toBe("");
  });

  it("[name='year'] input exists", async () => {
    const yearInput = await page.$("input[name='year']");
    expect(yearInput).not.toBeNull();
  });

  it("year input is empty", async () => {
    const yearValue = await page.$eval(
      "input[name='year']",
      (input) => (input as HTMLInputElement).value
    );
    expect(yearValue).toBe("");
  });

  it("Description textarea input exists", async () => {
    const descriptionTextarea = await page.$("textarea[name='description']");
    expect(descriptionTextarea).not.toBeNull();
  });

  it("Description textarea is empty", async () => {
    const descriptionValue = await page.$eval(
      "textarea[name='description']",
      (textarea) => (textarea as HTMLTextAreaElement).value
    );
    expect(descriptionValue).toBe("");
  });
  it("There is 1 #producer-id-help-text element", async () => {
    const helpTextElements = await page.$$("#producer-id-help-text");
    expect(helpTextElements.length).toBe(1);
  });
  it("#producer-id-help-text is not empty", async () => {
    const helpText = await page.$eval("#producer-id-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });

  it("#slug-help-text is not empty", async () => {
    const helpText = await page.$eval("#slug-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });

  it("#name-help-text is not empty", async () => {
    const helpText = await page.$eval("#name-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });
  it("#items-count-help-text is not empty", async () => {
    const helpText = await page.$eval("#items-count-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });
  it("#year-help-text has the correct hint", async () => {
    const helpText = await page.$eval("#year-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });

  it("#description-help-text has the correct hint", async () => {
    const helpText = await page.$eval("#description-help-text", (el) =>
      el.textContent?.trim()
    );
    expect(helpText).not.toBe("");
  });
  it("Submit button exists", async () => {
    const submitButton = await page.$("button[type='submit']");
    expect(submitButton).not.toBeNull();
  });
});
