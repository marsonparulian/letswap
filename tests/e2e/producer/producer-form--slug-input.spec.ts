// Scenario : test the `slug` input component in producer form, but will also works in form in general

import { Browser, Page } from "puppeteer";
import { mockUtils } from "@/tests/mocks/mock-utils";
import * as e2eUtils from "@/tests/e2e/utils";
import * as slugInputActions from "@/app/modules/slug-input/slug-input-actions";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import * as links from "@/app/lib/links/links";
import { init } from "next/dist/compiled/webpack/webpack";

describe("Test slug input component in producer from..", () => {
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
  describe("When [name='slug'] is empty..", () => {
    describe("After [name='name'] input is empty and off focus..", () => {
      let initialHelpText: string;

      beforeAll(async () => {
        // Focus to [name='name'] input
        await page.focus("input[name='name']");

        // Clear the input
        await page.keyboard.press("Backspace");

        // Off focus [name='name'] input by pressing tab
        await page.keyboard.press("Tab");

        // Capture the initial help text immediately after tab
        initialHelpText =
          (await page.$eval("#slug-help-text", (el) => el.textContent)) || "";
      });
      it("should not change slug value, help text, and help text classes during 600ms debounce period", async () => {
        const checkStates = async () => {
          // Check slug value
          const slugValue = await page.$eval(
            "input[name='slug']",
            (input) => (input as HTMLInputElement).value
          );
          expect(slugValue).toBe("");

          // Check help text content
          const helpText = await page.$eval(
            "#slug-help-text",
            (el) => el.textContent
          );
          expect(helpText).toBe(initialHelpText);
          expect(helpText).toBe(slugInputConfig.TEXT_INFO);

          // Check help text styling
          const helpTextClass = await page.$eval(
            "#slug-help-text p",
            (el) => el.className
          );
          expect(helpTextClass).toContain("secondary");
          expect(helpTextClass).not.toContain("alert");
        };

        // Check immediately
        await checkStates();

        // Check at 200ms
        await new Promise((resolve) => setTimeout(resolve, 200));
        await checkStates();

        // Check at 400ms
        await new Promise((resolve) => setTimeout(resolve, 200));
        await checkStates();

        // Check at 600ms
        await new Promise((resolve) => setTimeout(resolve, 200));
        await checkStates();
      });
    });
    describe("After [name='name'] input filled and off focus...", () => {
      // Set tag to be used in the test
      const tag = mockUtils.generateTag("test-producer").toLowerCase();
      const testName = `Test Producer ${tag}`;
      const expectedSlug = `test-producer-${tag}`;
      const initialHelpText = slugInputConfig.TEXT_INFO;

      beforeAll(async () => {
        // Focus on name input
        await page.focus("input[name='name']");

        // Type the test name
        await page.keyboard.type(testName);

        // Tab out to trigger the change event
        await page.keyboard.press("Tab");
      });

      it("Slug input should have the recommended slug based on name", async () => {
        const slugValue = await page.$eval(
          "input[name='slug']",
          (input) => (input as HTMLInputElement).value
        );
        expect(slugValue).toBe(expectedSlug);
      });

      it("Slug input should be read only while validating", async () => {
        const isReadOnly = await page.$eval(
          "input[name='slug']",
          (input) => (input as HTMLInputElement).readOnly
        );
        expect(isReadOnly).toBe(true);
      });

      it("The `#slug-help-text` should show 'validating slug' text", async () => {
        const helpText = await page.$eval(
          "#slug-help-text",
          (el) => el.textContent
        );
        expect(helpText).toBe(slugInputConfig.TEXT_VALIDATING);
      });

      it("#slug-help-text should not 'validating..' anymore after a while", async () => {
        // Wait for validation to complete
        await page.waitForFunction(
          (validatingText) => {
            const helpText =
              document.querySelector("#slug-help-text")?.textContent;
            return helpText !== validatingText;
          },
          {},
          slugInputConfig.TEXT_VALIDATING
        );
      });

      it("Should eventually show valid slug confirmation", async () => {
        // Wait for validation to complete
        await page.waitForFunction(
          (expectedText) => {
            const helpText =
              document.querySelector("#slug-help-text")?.textContent;
            return helpText === expectedText;
          },
          {},
          slugInputConfig.TEXT_OK
        );

        // Check help text class
        const helpTextClass = await page.$eval(
          "#slug-help-text p",
          (el) => el.className
        );
        expect(helpTextClass).toContain("secondary");
        expect(helpTextClass).not.toContain("alert");
      });

      it("Slug input should become editable again", async () => {
        const isReadOnly = await page.$eval(
          "input[name='slug']",
          (input) => (input as HTMLInputElement).readOnly
        );
        expect(isReadOnly).toBe(false);
      });
    });
  });
  describe("When [name='slug'] input is filled..", () => {
    describe("After [name='name'] is off focus..", () => {
      it.todo("Slug input should not changed");
      it.todo("Should not execute function to validate slug");
    });
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
