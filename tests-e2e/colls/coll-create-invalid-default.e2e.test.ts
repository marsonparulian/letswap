/**
 * Scenario : Invalid result after submit default form when creating `collection`
 * In general e2e tests will only cover whether the invalid messages are shown or not. E2e tests will not cover various kind of entries, as it will be tested in the 'action' components test (not e2e) for tests performance sake.
 *
 */
import { Browser, Page } from "puppeteer";
import * as utils from "@/tests-e2e/utils";
import * as texts from "@/app/lib/texts/texts";

describe("Submit default form when creating `collection`", () => {
  // Reff to puppeteer `browser` object
  let browser: Browser;
  // Reff to `Page` object that will be created in every `describe`
  let page: Page;
  // URL of the form to create new collection
  const formUrl = `${utils.BASE_URL}/collections/create`;

  beforeAll(async () => {
    // Launch browser
    browser = await utils.launchBrowser();
    page = await browser.newPage();
    // Open form
    await page.goto(formUrl);

    // Check if the submit button exists
    const submitButtonExists = (await page.$("button[type='submit']")) !== null;
    expect(submitButtonExists).toBe(true);

    // Remove dev panels
    await utils.removeAllDevelopmentElements(page);

    // Investigate: When load `/collections/create` page the first time, problem in the browser's console. Looks like JQuery is not loaded yet, and the Foundation JS is trying to use it
    // But if we load other page like `/` or /`collections` (no problem), and then load `/collections/create` page, the problem is gone.

    // Click the submit button
    await page.click("button[type='submit']");

    // Wait for the error message animation to be finished
    await utils.waitForSomeMiliseconds(1e3);
  });
  afterAll(async () => {
    // Close browser
    await browser.close();
  });

  it("The page should not navigate", async () => {
    // Check if the URL remains the same after submitting the form
    const currentUrl = page.url();
    expect(currentUrl).toBe(formUrl);
  });
  it("The page should not reload", async () => {
    // Check if the page did not reload by verifying no navigation occurred
    const navigationEntries = (await page.evaluate(() =>
      performance.getEntriesByType("navigation")
    )) as PerformanceNavigationTiming[];
    expect(navigationEntries.length).toBe(1);
    expect(navigationEntries[0].type).not.toBe("reload");
  });
  it("[name='producerId'] is empty", async () => {
    // Check if the producerId input is empty
    const producerIdValue = await page.$eval(
      "[name='producerId']",
      (el) => (el as HTMLInputElement).value
    );
    expect(producerIdValue).toBe("");
  });
  it("Error message for empty producer", async () => {
    // The expected error message
    const expected = texts.fieldIsRequired("Producer");

    // Get array of "#producer-id-help-text span" elements
    const errorMessages = await page.$$eval(
      "#producer-id-help-text span",
      (spans) => spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
  it("[name='slug'] is empty", async () => {
    // Check if the slug input is empty
    const slugValue = await page.$eval(
      "[name='slug']",
      (el) => (el as HTMLInputElement).value
    );
    expect(slugValue).toBe("");
  });
  it("Error message for empty slug", async () => {
    // The expected error message
    const expected = texts.fieldIsRequired("Slug");

    // Get array of "#slug-help-text span" elements
    const errorMessages = await page.$$eval("#slug-help-text span", (spans) =>
      spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
  it("[name='name'] is empty", async () => {
    // Check if the name input is empty
    const nameValue = await page.$eval(
      "[name='name']",
      (el) => (el as HTMLInputElement).value
    );
    expect(nameValue).toBe("");
  });
  it("Error message for empty name", async () => {
    // The expected error message
    const expected = texts.fieldIsRequired("Name");

    // Get array of "#name-help-text span" elements
    const errorMessages = await page.$$eval("#name-help-text span", (spans) =>
      spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });

  it("[name='itemsCount'] is empty", async () => {
    // Check if the itemsCount input is empty
    const itemsCountValue = await page.$eval(
      "[name='itemsCount']",
      (el) => (el as HTMLInputElement).value
    );
    expect(itemsCountValue).toBe("");
  });
  it("Error message for empty itemsCount", async () => {
    // The expected error message
    const expected = texts.fieldMinValue("Items", 2);

    // Get array of "#items-count-help-text span" elements
    const errorMessages = await page.$$eval(
      "#items-count-help-text span",
      (spans) => spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
  it("[name='year'] is empty", async () => {
    // Check if the year input is empty
    const yearValue = await page.$eval(
      "[name='year']",
      (el) => (el as HTMLInputElement).value
    );
    expect(yearValue).toBe("");
  });
  it("Error message for empty year", async () => {
    // The expected error message
    const expected = texts.fieldMinValue("Year", 2010);

    // Get array of "#year-help-text span" elements
    const errorMessages = await page.$$eval("#year-help-text span", (spans) =>
      spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
  it("[name='description'] is empty", async () => {
    // Check if the description input is empty
    const descriptionValue = await page.$eval(
      "textarea[name='description']",
      (el) => (el as HTMLTextAreaElement).value
    );
    expect(descriptionValue).toBe("");
  });
  it("Error message for empty description", async () => {
    // The expected error message
    const expected = texts.fieldMinLength("Description", 3);

    // Get array of "#description-help-text span" elements
    const errorMessages = await page.$$eval(
      "#description-help-text span",
      (spans) => spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
});
