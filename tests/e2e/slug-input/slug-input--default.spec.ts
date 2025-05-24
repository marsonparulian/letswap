// Contains: test slug input component -- the default state, including the effect of the props received from the parent component.

import { Page, Browser } from "puppeteer";
import * as e2eUtils from "@/tests/e2e/utils";
import * as links from "@/app/lib/links/links";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import * as slugInputTestUtils from "./slug-input--test-utils";

describe("Test slug input component -- default", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // Launch browser
    browser = await e2eUtils.launchBrowser();
    page = await browser.newPage();

    // Go to producer form
    await page.goto(`${e2eUtils.BASE_URL}${links.producerCreate()}`);

    // Remove next.js development panel
    await e2eUtils.removeAllDevelopmentElements(page);
  });

  afterAll(async () => {
    // Close browser
    await browser.close();
  });
  describe("Default state of slug input component..", () => {
    it("should be after `name` input", async () => {
      // Get all form field elements
      const formFields = await page.$$("input, select, textarea");

      // Find the name and slug input indexes
      let nameIndex = -1;
      let slugIndex = -1;

      for (let i = 0; i < formFields.length; i++) {
        const name = await formFields[i].evaluate((el) =>
          el.getAttribute("name")
        );
        if (name === "name") nameIndex = i;
        if (name === "slug") slugIndex = i;
      }

      // Check if slug input comes after name input in the DOM
      expect(nameIndex).toBeGreaterThan(-1);
      expect(slugIndex).toBe(nameIndex + 1);
    });

    it("should be empty by default", async () => {
      const slugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
      expect(slugValue).toBe("");
    });
    it("Help text should have 'label secondary' class", async () => {
      // Remember, the slug input is empty by default
      const helpTextClass = await slugInputTestUtils.getCurrentHelpTextClass(
        page
      );
      expect(helpTextClass).toBe(slugInputTestUtils.helpTextClass.onDefault);
    });
    it("should have `#slug-help-text.help-text` after the [name='slug'] input", async () => {
      // Get the slug input and help text elements
      const slugInput = await page.$("input[name='slug']");
      const helpText = await page.$("#slug-help-text");

      // Ensure both elements exist
      expect(slugInput).not.toBeNull();
      expect(helpText).not.toBeNull();

      // Check the variables are not nul to satisfy the typescript
      if (!slugInput || !helpText) throw new Error("Elements not found");

      // Get their positions in the DOM
      const slugInputIndex = await page.evaluate((el) => {
        return Array.from(document.querySelectorAll("*")).indexOf(el);
      }, slugInput);

      const helpTextIndex = await page.evaluate((el) => {
        return Array.from(document.querySelectorAll("*")).indexOf(el);
      }, helpText);

      // Check if help text comes after the slug input
      expect(helpTextIndex).toBeGreaterThan(slugInputIndex);

      // Verify the help text has the correct class
      const helpTextClass = await helpText.evaluate((el) => el.className);
      expect(helpTextClass).toContain("help-text");
    });

    it("The `#slug-help-text` should have the expected text", async () => {
      const helpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent
      );

      // The help text should show the default info text from slugInputActions
      expect(helpText).toBe(slugInputConfig.TEXT_INFO);
    });

    it("should have `aria-describedby` attribute with value of `slug-help-text`", async () => {
      const ariaDescribedby = await page.$eval("input[name='slug']", (el) =>
        el.getAttribute("aria-describedby")
      );
      expect(ariaDescribedby).toBe("slug-help-text");
    });

    it("#slug-help-text have role attribute with value 'status'", async () => {
      const role = await page.$eval("#slug-help-text", (el) =>
        el.getAttribute("role")
      );
      expect(role).toBe("status");
    });

    it("should have `aria-live` attribute with value of `polite`", async () => {
      const ariaLive = await page.$eval("#slug-help-text", (el) =>
        el.getAttribute("aria-live")
      );
      expect(ariaLive).toBe("polite");
    });
  });
});
