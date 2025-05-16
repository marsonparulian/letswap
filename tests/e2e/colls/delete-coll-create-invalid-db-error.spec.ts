// Scenario: Failed saving new Collection because of DB (datalink) error
import * as e2eUtils from "@/tests/e2e/utils";
import * as mockCollection from "@/tests/mocks/mock-collections";
import { Browser, Page } from "puppeteer";
import * as links from "@/app/lib/links/links";
import * as collE2eUtils from "@/tests/e2e/colls/coll-e2e-utils";

// Mock the function to save data to DB, to mimick DB connection error
// import { createCollecti on } from "@/app/lib/data/collections";
jest.mock("@/app/lib/data/collections", () => ({
  createCollection: jest.fn().mockRejectedValue(new Error("Mock DB error")),
}));

describe("Create collection invalid - DB error", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // Start browser
    browser = await e2eUtils.launchBrowser();
    page = await browser.newPage();
    // Open the form
    await page.goto(links.COLL_CREATE());

    // Remove nextjs dev panel
    await e2eUtils.removeAllDevelopmentElements(page);
  });
  afterAll(async () => {
    // Close browser
    await browser.close();
  });
  it("Fill in the form", async () => {
    const mockData = mockCollection.validUnsavedCollectionFormData();

    await collE2eUtils.fillCollectionForm(page, mockData);
  });
  it("Click the submit button & wait for 2 seconds", async () => {});
  it.todo("Error message in the roler=status element");
  it.todo("URL not changed");
});
