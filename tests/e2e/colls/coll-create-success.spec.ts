// Scenario: Create a collection successfully

import { Browser, Page } from "puppeteer";
import * as e2eUtils from "@/tests/e2e/utils";
import * as mockCollections from "@/tests/mocks/mock-collections";
import * as texts from "@/app/lib/texts/texts";
import * as links from "@/app/lib/links/links";
import * as collE2eUtils from "@/tests/e2e/colls/coll-e2e-utils";

describe("Create a collection successfully", () => {
  let browser: Browser;
  let page: Page;
  // Mock data
  const mockFormData = mockCollections.validUnsavedCollectionFormData();

  beforeAll(async () => {
    browser = await e2eUtils.launchBrowser();
    page = await browser.newPage();
    await page.goto(e2eUtils.URL_COLL_CREATE);

    // Remove the next dev panel
    await e2eUtils.removeAllDevelopmentElements(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("Form #coll-form exist", async () => {
    const form = await page.$("#coll-form");
    expect(form).not.toBeNull();
  });

  it("Fill the form with valid data", async () => {
    await collE2eUtils.fillCollectionForm(page, mockFormData);
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
    expect(newUrl).toBe(e2eUtils.URL_COLL_LIST);
  });

  it("Success message should be in the element with `role=status`", async () => {
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

  it("Saved collection should appears at the top of collection list", async () => {
    // Get the first item in the collection list
    const firstItem = await page.$("#coll-list li:first-child");
    if (!firstItem) {
      throw new Error("The first collection item is not found");
    }

    // Get the collection name from the first item
    const nameSelector = "h3";
    const firstCollName = await firstItem.$eval(
      nameSelector,
      (el) => el.textContent
    );
    expect(firstCollName).toBe(mockFormData.get("name"));

    // Check that the `name` is a link to the collection detail page
    const mockSlug: string = mockFormData.get("slug")?.toString() || "";
    const firstCollNameLink = await firstItem.$eval(`${nameSelector} a`, (el) =>
      el.getAttribute("href")
    );
    expect(firstCollNameLink).toBe(links.collPage(mockSlug));

    // NOTE: no need to verify for the rest of the elements, because it has been checked in other test file (coll-list-card.ts)
  });
});
