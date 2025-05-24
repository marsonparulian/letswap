// Contains: Test slug input component -- related to the effect of input `name` related activities.

import { Page, Browser } from "puppeteer";
import * as e2eUtils from "@/tests/e2e/utils";
import * as links from "@/app/lib/links/links";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import * as slugInputActions from "@/app/modules/slug-input/slug-input-actions";
import { mockUtils } from "@/tests/mocks/mock-utils";

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
  describe("Name input is filled, then onBlur", () => {
    const tag = mockUtils.generateTag("test-producer-blur").toLowerCase();
    const testName = `Test Producer ${tag}`;
    const expectedSlug = `test-producer-${tag}`;
    let initialSlugValue: string;
    let initialHelpText: string;

    beforeAll(async () => {
      // Focus on name input
      await page.focus("input[name='name']");

      // Type the test name
      await page.keyboard.type(testName);

      // Tab out to trigger the change event and wait for slug to be set
      await page.keyboard.press("Tab");

      // Wait for the slug to be validated and set
      await page.waitForFunction(
        (validatingText) => {
          const helpText =
            document.querySelector("#slug-help-text")?.textContent;
          return helpText !== validatingText;
        },
        {},
        slugInputConfig.TEXT_VALIDATING
      );

      // Store initial values
      initialSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );

      initialHelpText =
        (await page.$eval("#slug-help-text", (el) => el.textContent)) || "";

      // Focus on slug input and then tab out
      await page.focus("input[name='slug']");
      await page.keyboard.press("Tab");

      // Wait a moment to ensure any potential changes would have occurred
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    it("Slug input should not change on blur", async () => {
      const currentSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
      expect(currentSlugValue).toBe(initialSlugValue);
    });

    it("Help text should not change on blur", async () => {
      const currentHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent
      );
      expect(currentHelpText).toBe(initialHelpText);

      // Also verify the styling hasn't changed
      const helpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );
      expect(helpTextClass).toContain("secondary");
      expect(helpTextClass).not.toContain("alert");
    });
  });
  describe("Name & slug inputs are filled then name input onBlur", () => {
    const tag = mockUtils.generateTag("test-producer-blur").toLowerCase();
    const nameValue = `Test Producer ${tag}`;
    const slugValue = `slug-001-${tag}`;

    let initialHelpText: string;
    let initialHelpTextClass: string;

    beforeAll(async () => {
      // Reload the page to reset the state
      await page.reload();

      // Fill in the slug input first
      await page.focus("input[name='slug']");
      await page.keyboard.type(slugValue);
      await page.keyboard.press("Tab");

      // Wait for any potential validation after slug input
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Store initial slug validation state
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Fill in the name input
      await page.focus("input[name='name']");
      await page.keyboard.type(nameValue);

      // Tab away from the name input to see the effect
      await page.keyboard.press("Tab");
    });

    it("Slug value, help text, and help text class should not change within 600ms debounce period", async () => {
      const checkStates = async () => {
        // Check slug value hasn't changed
        const currentSlugValue = await page.$eval(
          "input[name='slug']",
          (input) => (input as HTMLInputElement).value
        );
        expect(currentSlugValue).toBe(slugValue);

        // Check help text content hasn't changed
        const currentHelpText = await page.$eval(
          "#slug-help-text",
          (el) => el.textContent
        );
        expect(currentHelpText).toBe(initialHelpText);

        // Check help text styling hasn't changed
        const currentHelpTextClass = await page.$eval(
          "#slug-help-text p",
          (el) => el.className
        );
        expect(currentHelpTextClass).toBe(initialHelpTextClass);
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
});
