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
    }
  });

  it("Submit the form and redirected to the collection list", async () => {
    await page.click("#coll-form button[type='submit']");

    // Wait until current URL is changed
    try {
      await page.waitForFunction(
        () => {
          const url = window.location.href;
          return url !== utils.URL_COLL_CREATE;
        },
        { timeout: 8e3 }
      );
    } catch (e) {
      console.log("Error waiting for URL of collection form to change:", e);
    }

    // Check if the URL is the collection list page
    const url = page.url();
    expect(url).toBe(utils.URL_COLL_LIST);
  });

  it.skip("Check success message in the element with `role=status`", async () => {
    const successMessage = await page.$eval(
      "[role=status], [aria-live=assertive]",
      (el) => el.textContent
    );
    expect(successMessage).toBe(texts.savedSuccessfully("Collection"));
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
