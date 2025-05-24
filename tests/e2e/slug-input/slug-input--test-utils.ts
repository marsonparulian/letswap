import * as links from "@/app/lib/links/links";
import * as slugInputConfig from "@/app/modules/slug-input/slug-input-config";
import mockUtils from "@/tests/mocks/mock-utils";
import { Browser, Page } from "puppeteer";
import * as e2eUtils from "../utils";

export const helpTextClass = {
  onDefault: "label secondary",
  onAlert: "label alert",
  onSuccess: "label success",
};
export interface SlugInputState {
  slugValue: string;
  helpText: string;
  helpTextClass: string;
  isReadOnly: boolean;
}

export const checkStates = async (
  page: Page,
  expectedState: SlugInputState
) => {
  // Check slug value
  const slugValue = await page.$eval(
    "input[name='slug']",
    (input) => (input as HTMLInputElement).value
  );

  try {
    expect(slugValue).toBe(expectedState.slugValue);
  } catch (error) {
    console.error(
      `slug value not as expected. Expected: ${expectedState.slugValue}`
    );
    throw error;
  }

  // Check readOnly state
  const isReadOnly = await page.$eval(
    "input[name='slug']",
    (input) => (input as HTMLInputElement).readOnly
  );

  try {
    expect(isReadOnly).toBe(expectedState.isReadOnly);
  } catch (error) {
    console.error(
      `slug input readOnly state not as expected. Expected: ${expectedState.isReadOnly}`
    );
    throw error;
  }

  // Check help text
  const helpText = await page.$eval("#slug-help-text", (el) => el.textContent);
  try {
    expect(helpText).toBe(expectedState.helpText);
  } catch (error) {
    console.error(
      `slug help text not as expected. Expected: ${expectedState.helpText}`
    );
    throw error;
  }

  // Check help text class
  const helpTextClass = await page.$eval(
    "#slug-help-text p",
    (el) => el.className
  );
  try {
    expect(helpTextClass).toBe(expectedState.helpTextClass);
  } catch (error) {
    console.error(
      `slug help text class not as expected. Expected: ${expectedState.helpTextClass}`
    );
    throw error;
  }
};

export const checkStatesWithIntervals = async (
  page: Page,
  expectedState: SlugInputState
) => {
  // Check immediately
  await checkStates(page, expectedState);

  // Check at 200ms
  await new Promise((resolve) => setTimeout(resolve, 200));
  await checkStates(page, expectedState);

  // Check at 400ms
  await new Promise((resolve) => setTimeout(resolve, 200));
  await checkStates(page, expectedState);

  // Check at 600ms
  await new Promise((resolve) => setTimeout(resolve, 200));
  await checkStates(page, expectedState);
};

/**
 * Function to wait for the help text to change
 * @return {Promise<string>} - A promise that resolves when the help text changes and will return the updated help text
 */
export const waitForTheHelpTextToChange = async (
  page: Page
): Promise<string> => {
  // Get the current help text
  const currentHelpText = await getCurrentHelpText(page);

  // Wait until the help text changes
  try {
    await page.waitForFunction(
      (currentText) => {
        const helpTextElement = document.querySelector("#slug-help-text");
        return helpTextElement && helpTextElement.textContent !== currentText;
      },
      {},
      currentHelpText
    );
  } catch (e) {
    console.error(
      `Timeout waiting for slug help text. Expected: ${currentHelpText}`
    );
    throw e;
  }

  // Get the updated help text
  const updatedHelpText =
    (await page.$eval("#slug-help-text", (element) => element.textContent)) ||
    "";

  return updatedHelpText;
};

export const getCurrentHelpText = async (page: Page): Promise<string> => {
  const helpText = await page.$eval("#slug-help-text", (el) => el.textContent);
  return helpText || "";
};
export const getCurrentHelpTextClass = async (page: Page): Promise<string> => {
  const helpTextClass = await page.$eval(
    "#slug-help-text p",
    (el) => el.className
  );
  return helpTextClass || "";
};
export const getCurrentSlugValue = async (page: Page): Promise<string> => {
  const slugValue = await page.$eval(
    "input[name='slug']",
    (input) => (input as HTMLInputElement).value
  );
  return slugValue || "";
};
