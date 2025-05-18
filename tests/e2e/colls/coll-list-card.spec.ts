// Contains tests against list of collections

import { Browser, Page, ElementHandle } from "puppeteer";
import { retrieve } from "@/app/lib/data/collections";
import { getProducerById } from "@/app/lib/data/producers";
import { closeSqlConnection } from "@/app/lib/data/utils";
import * as e2eUtils from "@/tests/e2e/utils";
import * as links from "@/app/lib/links/links";

describe("Collection card should..", () => {
  let browser: Browser;
  let page: Page;
  let firstCard: ElementHandle<Element> | null;

  // Selector of collection card in the page
  const collCardsSelector = "main li.card";

  // The latest collection in DB
  let newestCol: Collection;
  // Producer of the newestCol
  let producer: Producer;

  beforeAll(async () => {
    // Retrieve collections right from DB
    const collsInDb = await retrieve();
    if (collsInDb.length == 0) {
      throw new Error(
        "Test error: 0 collections retrieved from DB. Should at least 1 collecion record"
      );
    }
    // Get the newest collection retrieve from DB
    newestCol = collsInDb[0];

    // Get the producer
    const returnedProducer = await getProducerById(newestCol.producerId);
    // Throw error if can't find the producer
    if (!returnedProducer)
      throw new Error(`Can't get producer by slug ${newestCol.slug}`);
    // Assign the returned
    producer = returnedProducer;

    // Lauch browser
    browser = await e2eUtils.launchBrowser();
    page = await browser.newPage();

    // Go to URL_COLL (Collection list)
    await page.goto(e2eUtils.URL_COLL_LIST);

    // Remove dev panel
    await e2eUtils.removeAllDevelopmentElements(page);

    // Get the first card for all tests
    firstCard = await page.$(`${collCardsSelector}:first-child`);

    if (!firstCard) {
      throw new Error("No collection card found");
    }
  });

  afterAll(async () => {
    // Close the sql connection
    await closeSqlConnection();

    // Close browser
    await browser.close();
  });

  it("In the list, there are at least 1 card", async () => {
    const cardElementsCount = await page.$$eval(
      collCardsSelector,
      (elements) => elements.length
    );
    expect(cardElementsCount).toBeGreaterThanOrEqual(1);
  });

  it("have h2, h3, or h4 that is the collection `name`", async () => {
    const headingText = await firstCard!.$eval(
      "h2, h3, h4",
      (el: Element) => el.textContent
    );
    expect(headingText).toBe(newestCol.name);
  });

  it("Have h2,h3, or h4 that is a link to the collection detail page", async () => {
    const linkHref = await firstCard!.$eval(
      "h2 a, h3 a, h4 a",
      (el: HTMLAnchorElement) => el.getAttribute("href")
    );
    expect(linkHref).toBe(links.collPage(newestCol.slug));
  });

  it("Have the correct producer name & corresponding link ", async () => {
    const producerSelector = ".f-producer-name";

    // Assert the text
    const producerName = await firstCard!.$eval(
      producerSelector,
      (el: Element) => el.textContent
    );
    expect(producerName).toBeTruthy();
    expect(producerName).toBe(producer.name);

    // Assert the link
    const producerLink = await firstCard!.$eval(
      ".f-producer-name a",
      (el: HTMLAnchorElement) => el.getAttribute("href")
    );
    expect(producerLink).toBe(links.producerPage(producer.slug));
  });

  it("Have the `year`", async () => {
    const yearText = await firstCard!.$eval(
      ".f-year",
      (el: Element) => el.textContent
    );
    expect(yearText).toBe(newestCol.year.toString());
  });

  it("Have `itemsCount`", async () => {
    const itemsCountText = await firstCard!.$eval(
      ".f-items-count",
      (el: Element) => el.textContent
    );
    expect(parseInt(itemsCountText || "0")).toBe(newestCol.itemsCount);
  });

  it("have the `description`", async () => {
    const description = await firstCard!.$eval(
      ".f-description",
      (el: Element) => el.textContent
    );
    expect(description).toBe(newestCol.description);
  });
  it("Have link to the detail page with class 'button'", async () => {
    const detailLink = await firstCard!.$eval(
      "a.button",
      (el: HTMLAnchorElement) => el.getAttribute("href")
    );
    expect(detailLink).toBe(links.collPage(newestCol.slug));
  });
});
