// In this file, we test the slug input component when user input in a manual way.

import { Page, Browser } from "puppeteer";
import * as slugInputUtils from "@/tests/e2e/slug-input/slug-input--test-utils";
import * as e2eUtils from "@/tests/e2e/utils";
import mockUtils from "@/tests/mocks/mock-utils";
import * as links from "@/app/lib/links/links";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import * as slugInputActions from "@/app/modules/slug-input/slug-input-actions";
import * as slugInputTestUtils from "@/tests/e2e/slug-input/slug-input--test-utils";
import {
  createProducer,
  deleteProducer,
  deleteProducerBySlug,
} from "@/app/lib/data/producers";
import { closeSqlConnection } from "@/app/lib/data/utils";

// Importing the interface and functions from utils
import {
  SlugInputState,
  checkStates,
  checkStatesWithIntervals,
} from "./slug-input--test-utils";

describe("Test slug input component -- manual edit", () => {
  let browser: Browser;
  let page: Page;

  let initialSlugValue: string;
  let initialHelpText: string;
  let initialHelpTextClass: string;
  let currentHelpText: string;

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

  describe("Slug input is empty, then on focus..", () => {
    let initialHelpText: string;
    let initialHelpTextClass: string;

    beforeAll(async () => {
      // Ensure the slug input is empty
      await page.evaluate(() => {
        const input = document.querySelector(
          'input[name="slug"]'
        ) as HTMLInputElement;
        if (input) input.value = "";
      });

      // Get initial states
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Focus on the empty slug input
      await page.focus("input[name='slug']");
    });

    it("should maintain empty slug, help text, and styling during 600ms period", async () => {
      const expectedState: SlugInputState = {
        slugValue: "",
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };

      await checkStatesWithIntervals(page, expectedState);
    });
  });

  describe("Slug input is not empty, then on focus..", () => {
    let initialSlugValue: string;
    let initialHelpText: string;
    let initialHelpTextClass: string;

    beforeAll(async () => {
      // Reload the page to reset the state
      await page.reload();
      await e2eUtils.removeAllDevelopmentElements(page);

      // Set a non-empty value in the slug input
      const testSlug = "test-slug-" + mockUtils.generateTag("test-slug");
      await page.keyboard.type(testSlug);

      // Wait for any validation to complete
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Store initial states
      initialSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Focus again on the slug input
      await page.focus("input[name='slug']");
    });

    it("should maintain slug value, help text, and styling during 600ms period", async () => {
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };

      await checkStatesWithIntervals(page, expectedState);
    });
  });

  describe("When user type in 2 characters in [name='slug'] input..", () => {
    let initialSlugValue: string;
    let initialHelpText: string;
    let initialHelpTextClass: string;
    beforeAll(async () => {
      // Reload the page to reset the state
      await page.reload();
      await e2eUtils.removeAllDevelopmentElements(page);

      // Focus on the slug input
      await page.focus("input[name='slug']");

      // Store initial states before typing
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Type first character
      await page.keyboard.type("a");

      // Type the second character
      await page.keyboard.type("b");

      // Store the slug value after typing
      initialSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
    });

    it("should maintain the expected state before debounce delay", async () => {
      const expectedStateBeforeDelay: SlugInputState = {
        slugValue: initialSlugValue,
        // Slug validation not yet happened, because of the debounce delay
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };

      await checkStates(page, expectedStateBeforeDelay).catch((e) => {
        console.error(`State is not as expected before delay`);
        throw e;
      });
    });
    it("Help text should show 'validating..' text after debounce delay 500ms", async () => {
      // Wait until help text changes to validating state
      try {
        await page.waitForFunction(
          (validatingText) => {
            const helpTextElement = document.querySelector("#slug-help-text");
            return (
              helpTextElement && helpTextElement.textContent === validatingText
            );
          },
          {},
          slugInputConfig.TEXT_VALIDATING
        );
      } catch (e) {
        console.error(
          `Timeout waiting for slug help text. Expected: ${slugInputConfig.TEXT_VALIDATING}`
        );
        throw e;
      }
    });
    it("Help text should show 'invalid' validation result after debounce delay", async () => {
      // Wait until help text changes
      try {
        await page.waitForFunction(
          (invalidMessage) => {
            const helpTextElement = document.querySelector(
              "#slug-help-text"
            ) as HTMLDivElement;
            return (
              helpTextElement && helpTextElement.textContent === invalidMessage
            );
          },
          {},
          slugInputConfig.TEXT_INVALID_LENGTH
        );
      } catch (e) {
        console.error(
          `Timeout waiting for slug help text. Expected: ${slugInputConfig.TEXT_INVALID_LENGTH}`
        );
        throw e;
      }
    });
  });

  describe("When user type in 3 characters in [name='slug'] input..", () => {
    const slugToType = "abc";
    beforeAll(async () => {
      // Reload the page to reset the state
      await page.reload();
      await e2eUtils.removeAllDevelopmentElements(page);

      // Store initial states before typing
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Focus on the slug input
      await page.focus("input[name='slug']");

      // Type the slug
      await page.keyboard.type(slugToType);

      // Store the slug value after typing
      initialSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
    });
    it("Before 500ms, state of slug input and help text should not changed", async () => {
      // Wait 100ms before the debounce timeout(500ms)
      await new Promise((r) =>
        setTimeout(r, slugInputConfig.DEBOUNCE_DELAY - 100)
      );

      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };
      await checkStates(page, expectedState);
    });
    it("After 500ms, help text should be 'validating slug' text", async () => {
      // Wait until help text changes to validating state
      try {
        await page.waitForFunction(
          (validatingText) => {
            const helpTextElement = document.querySelector("#slug-help-text");
            return (
              helpTextElement && helpTextElement.textContent === validatingText
            );
          },
          {},
          slugInputConfig.TEXT_VALIDATING
        );
      } catch (e) {
        console.error(
          `Timeout waiting for slug help text. Expected: ${slugInputConfig.TEXT_VALIDATING}`
        );
        throw e;
      }

      // Check the state after 500ms
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: slugInputConfig.TEXT_VALIDATING,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };
      await checkStates(page, expectedState);
    });
    it("Then help text should shown 'invalid' or 'valid' result text", async () => {
      // The possible result text should be 'invalid' or 'valid'
      const expectedResultText = [
        slugInputConfig.TEXT_UNAVAILABLE,
        slugInputConfig.TEXT_OK,
      ];

      // Read the hep text
      const prevHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );

      // Wait for the help text to change
      await page.waitForFunction(
        (prevHelpText) => {
          const helpTextElement = document.querySelector(
            "#slug-help-text"
          ) as HTMLDivElement;
          return (
            helpTextElement && helpTextElement.textContent !== prevHelpText
          );
        },
        {},
        prevHelpText
      );

      // Get the help text after validation
      const currentHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent
      );

      // Check if the help text is one of the expected results
      expect(expectedResultText).toContain(currentHelpText);
    });
    it("Class of help text should be related to the result", async () => {
      // Get the help text
      const helpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent
      );
      // Get the class of the help text
      currentHelpText = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Check the class of the help text
      switch (helpText) {
        case slugInputConfig.TEXT_OK:
          // Class name should not contain 'error', 'alert', or 'warning'
          expect(currentHelpText).not.toContain("error");
          expect(currentHelpText).not.toContain("alert");
          expect(currentHelpText).not.toContain("warning");
          // Class name should contain 'success'
          expect(currentHelpText).toContain("success");
          break;
        case slugInputConfig.TEXT_UNAVAILABLE:
          // Class name should contain 'warning'
          expect(currentHelpText).toContain("warning");
          // Class name should not contain 'success'
          expect(currentHelpText).not.toContain("success");
          break;
        default:
          // If the help text is neither 'valid' nor 'invalid', throw an error
          throw new Error(
            `Unexpected help text: ${helpText}. Expected 'valid' or 'invalid'.`
          );
      }
    });
  });

  describe("When user type in invalid characters in [name='slug'] input..", () => {
    // Note: Slug characters validation should be done in the frontend before sending to the backend
    const slugToType = "abc$%&";
    beforeAll(async () => {
      // Reload the page to reset the state
      await page.reload();
      await e2eUtils.removeAllDevelopmentElements(page);

      // Store initial states before typing
      initialHelpText = await page.$eval(
        "#slug-help-text",
        (el) => el.textContent || ""
      );
      initialHelpTextClass = await page.$eval(
        "#slug-help-text p",
        (el) => el.className
      );

      // Focus on the slug input
      await page.focus("input[name='slug']");

      // Type the slug
      await page.keyboard.type(slugToType);

      // Store the slug value after typing
      initialSlugValue = await page.$eval(
        "input[name='slug']",
        (input) => (input as HTMLInputElement).value
      );
    });
    it("Nothing should be changed, because of the debounce delay not yet reached", async () => {
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };

      checkStates(page, expectedState).catch((e) => {
        console.error(`State is not as expected before delay`);
        throw e;
      });
    });
    it("Wait until help text changes, it should be 'validating' text", async () => {
      // Wait until help text changes to validating state
      currentHelpText =
        (await slugInputUtils.waitForTheHelpTextToChange(page)) || "";
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: slugInputConfig.TEXT_VALIDATING,
        helpTextClass: slugInputTestUtils.helpTextClass.onDefault,
        isReadOnly: false,
      };

      await checkStates(page, expectedState).catch((e) => {
        console.error(
          `State is not as expected after typing invalid characters.`
        );
        console.error(`expected: ${expectedState}`);
        throw e;
      });
      expect(currentHelpText).toBe(slugInputConfig.TEXT_VALIDATING);
    });
    it("Wait until help text changes, it should be 'invalid' text", async () => {
      // Wait until help text is changed
      currentHelpText = await slugInputUtils.waitForTheHelpTextToChange(page);

      // Expected state, help text and the classes
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: slugInputConfig.TEXT_INVALID_CHARACTERS,
        helpTextClass: slugInputTestUtils.helpTextClass.onAlert,
        isReadOnly: false,
      };

      // Assert
      await checkStates(page, expectedState).catch((e) => {
        console.error(
          `State is not as expected after typing invalid characters.`
        );
        console.error(`expected: ${expectedState}`);
        throw e;
      });
    });
  });

  describe("When user type in unavailable / taken slug in [name='slug'] input..", () => {
    let slugToType = "taken-slug";
    beforeAll(async () => {
      // Add tag so this tag will not conflict with the existing ones
      slugToType = "taken-slug-" + mockUtils.generateTag("taken-slug");
      // Save the slug directlyto DB so it is unavailable
      await createProducer({
        id: 0,
        slug: slugToType,
        name: "Test Producer",
        description: "Test description",
      });

      // Reload the page to reset the state
      await page.reload();
      await e2eUtils.removeAllDevelopmentElements(page);

      // Store initial states before typing
      initialHelpText = await slugInputTestUtils.getCurrentHelpText(page);
      initialHelpTextClass = await slugInputTestUtils.getCurrentHelpTextClass(
        page
      );

      // Focus on the slug input
      await page.focus("input[name='slug']");

      // Type the slug
      await page.keyboard.type(slugToType);

      // Store the slug value after typing
      initialSlugValue = await slugInputTestUtils.getCurrentSlugValue(page);
    });
    afterAll(async () => {
      // Remove the slug from DB
      await deleteProducerBySlug(slugToType);
      // Close the db connection
      await closeSqlConnection();
    });
    it("Nothing should be changed, because of the debounce delay not yet reached", async () => {
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: initialHelpText,
        helpTextClass: initialHelpTextClass,
        isReadOnly: false,
      };

      checkStates(page, expectedState).catch((e) => {
        console.error(`State is not as expected before delay`);
        throw e;
      });
    });
    it("Wait until help text changes, it should be 'validating' text", async () => {
      // Wait until help text changes to validating state
      currentHelpText =
        (await slugInputUtils.waitForTheHelpTextToChange(page)) || "";
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: slugInputConfig.TEXT_VALIDATING,
        helpTextClass: slugInputTestUtils.helpTextClass.onDefault,
        isReadOnly: false,
      };

      await checkStates(page, expectedState).catch((e) => {
        console.error(
          `State is not as expected after typing invalid characters.`
        );
        console.error(`expected: ${expectedState}`);
        throw e;
      });
      expect(currentHelpText).toBe(slugInputConfig.TEXT_VALIDATING);
    });
    it("Wait until help text changes, it should be 'unavailable' text", async () => {
      // Wait until help text is changed
      currentHelpText = await slugInputUtils.waitForTheHelpTextToChange(page);

      // Expected state, help text and the classes
      const expectedState: SlugInputState = {
        slugValue: initialSlugValue,
        helpText: slugInputConfig.TEXT_UNAVAILABLE,
        helpTextClass: slugInputTestUtils.helpTextClass.onAlert,
        isReadOnly: false,
      };

      // Assert
      await checkStates(page, expectedState).catch((e) => {
        console.error(
          `State is not as expected after typing unavailable slug.`
        );
        console.error(`expected: ${expectedState}`);
        throw e;
      });
    });
  });

  describe("When user delete some characters in [name='slug'] input..", () => {
    const slugToType = "test-slug" + mockUtils.generateTag("test-slug");
  });
});
