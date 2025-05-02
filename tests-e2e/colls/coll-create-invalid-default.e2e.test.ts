/**
 * Scenario : Invalid result after submit default form when creating `collection`
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
    // Press submit button
    await page.click("button[type='submit']");
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
  it("[name='producerId'] is empty & no error message", async () => {
    // Check if the producerId input is empty
    const producerIdValue = await page.$eval(
      "[name='producerId']",
      (el) => (el as HTMLInputElement).value
    );
    expect(producerIdValue).toBe("");
  });
  it("Error message for empty producer", async () => {
    // The expected error message
    const expected = texts.fieldIsRequired(texts.fieldIsRequired("producer"));

    // Get array of "#producer-id-help-text label" elements
    const errorMessages = await page.$$eval(
      "producer-id-help-text label",
      (spans) => spans.map((span) => span.textContent)
    );

    // Expect the error message to be present
    expect(errorMessages).toContain(expected);
  });
  it.todo("[name='slug'] is empty");
  it.todo("Error message for empty slug");
  it.todo("[name='name'] is empty");
  it.todo("Error message for empty name");
  it.todo("[name='description'] is empty");
  it.todo("Error message for empty description");
});
