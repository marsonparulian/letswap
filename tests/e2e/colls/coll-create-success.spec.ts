// Scenario: Create a collection successfully

import { Browser, Page } from "puppeteer";
import * as utils from "@/tests/e2e/utils";
import * as mockCollections from "@/tests/mocks/mock-collections";
import * as texts from "@/app/lib/texts/texts";

describe("Create a collection successfully", () => {
  let browser: Browser;
  let page: Page;
  // Mock data
  const mockFormData = mockCollections.validUnsavedCollectionFormData();

  beforeAll(async () => {
    browser = await utils.launchBrowser();
    page = await browser.newPage();
    await page.goto(utils.URL_COLL_CREATE);

    // Remove the next dev panel
    await utils.removeAllDevelopmentElements(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Form #coll-form exist", async () => {
    const form = await page.$("#coll-form");
    expect(form).not.toBeNull();
  });

  it("Fill the form with valid data", async () => {
    // Fill the form with valid data. Iterate through all form fields and fill them
    for (const [fieldName, fieldValue] of mockFormData.entries()) {
      await page.type(
        `#coll-form [name='${fieldName}']`,
        fieldValue.toString()
      );
      // If the filedName == "producerId", select the option
      if (fieldName === "producerId") {
        await page.select(
          `#coll-form [name='${fieldName}']`,
          fieldValue.toString()
        );
      }
    }
  });

  it("Submit the form and redirected to the collection list", async () => {
    // Get the current URL
    const url = page.url();

    // Await for 2 events, submit button click and URL change
    try {
      await Promise.all([
        page.waitForFunction(
          async (url) => {
            // IMPORTANT this runs on browser context
            const urlInBrowser = window.location.href;

            return urlInBrowser !== url;
          },
          { timeout: 6e3 },
          url
        ),
        page.click("#coll-form button[type='submit']"),
      ]);
    } catch (e) {
      console.error(`URL should have changed. Currently ${url}`);
      console.error(e);
    }

    // Check if the URL is the collection list page
    const newUrl = await page.url();
    expect(newUrl).toBe(utils.URL_COLL_LIST);
  });

  it("Check success message in the element with `role=status`", async () => {
    const successMessage = await page.$eval(
      "[role=status], [aria-live=assertive]",
      (el) => el.textContent
    );
    expect(successMessage).toBe(texts.savedSuccessfully("Collection"));
  });

  it("The collection list page should have 'li' element as collection item '", async () => {
    const listContainer = await page.$$("main #coll-list");
    expect(listContainer.length).toBeGreaterThan(0);
    const collectionItems = await page.$$("main #coll-list li");
    expect(collectionItems.length).toBeGreaterThan(0);
  });

  it.skip("Check if saved collection appears at the top of collection list", async () => {
    await page.goto(utils.URL_COLL_LIST);
    await page.waitForSelector("[data-test='coll-list'] li:first-child");

    // Get the first item in the collection list
    const firstItem = await page.$("[data-test='coll-list'] li:first-child");
    if (!firstItem) {
      throw new Error("The first collection item is not found");
    }

    // Get the collection name from the first item
    const firstCollName = await firstItem.$eval(
      ".f-name",
      (el) => el.textContent
    );
    expect(firstCollName).toBe(mockFormData.get("name"));

    // Check the link
    // Check the year
    const firstCollYear = await firstItem.$eval(
      ".f-year",
      (el) => el.textContent
    );
    expect(firstCollYear).toBe(mockFormData.get("year"));

    // Check the number of items
    const firstCollItems = await firstItem.$eval(
      ".f-items",
      (el) => el.textContent
    );
    expect(firstCollItems).toBe(mockFormData.get("itemsCount"));

    // Check the description
    const firstCollDesc = await firstItem.$eval(
      ".f-description",
      (el) => el.textContent
    );
    expect(firstCollDesc).toBe(mockFormData.get("description"));
  });
});
