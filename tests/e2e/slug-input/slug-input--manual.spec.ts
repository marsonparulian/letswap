// In this file, we test the slug input component when user input in a manual way.

import { Page, Browser } from "puppeteer";
import * as e2eUtils from "@/tests/e2e/utils";
import * as links from "@/app/lib/links/links";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import * as slugInputActions from "@/app/modules/slug-input/slug-input-actions";

describe("Test slug input component -- manual edit", () => {
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

  describe("When [name='slug'] is on focus..", () => {
    it.todo("The `#slug-help-text` should not changed");
    it.todo("Should not execute function to validate slug");
  });
  describe("When user type in 2 characters in [name='slug'] input..", () => {
    it.todo("The `#slug-help-text` should not changed");
    it.todo("Should not execute function to validate slug");
  });
  describe("When user type in 3 characters in [name='slug'] input..", () => {
    describe("Before 500ms .. ", () => {
      it.todo("The `#slug-help-text` should not changed");
      it.todo("Should not execute function to validate slug");
    });
    describe("After 500ms .. ", () => {
      it.todo("The `#slug-help-text` should have 'validating slug' text");
      it.todo("Should execute function to validate slug");
      it.todo("The `#slug-help-text` should have one of 3 result message text");
    });
  });
  describe("When user type in invalid characters in [name='slug'] input..", () => {
    // Slug characters validation should be done in the frontend before sending to the backend
    describe("Before 500ms .. ", () => {
      it.todo("The `#slug-help-text` should not changed");
      it.todo("Should not execute function to validate slug");
    });
    describe("After 500ms .. ", () => {
      it.todo("The `#slug-help-text` should still show 'invalid slug' text");
      it.todo("Should not execute function to validate slug");
    });
  });
  describe("When user type in unavailable / taken slug in [name='slug'] input..", () => {
    describe("Before 500ms .. ", () => {
      it.todo("The `#slug-help-text` should not changed");
      it.todo("Should not execute function to validate slug");
    });
    describe("After 500ms .. ", () => {});
    it.todo("Should execute function to validate slug");
    it.todo("The `#slug-help-text` should have 'unavailable slug' text");
  });
  describe("When user delete some characters in [name='slug'] input..", () => {
    describe("Before 500ms .. ", () => {
      it.todo("The `#slug-help-text` should not changed");
      it.todo("Should not execute function to validate slug");
    });
    describe("After 500ms .. ", () => {
      it.todo("The `#slug-help-text` should have 'validating slug' text");
      it.todo("Should execute function to validate slug");
      it.todo("The `#slug-help-text` should showing appropriate result text");
    });
  });
});
