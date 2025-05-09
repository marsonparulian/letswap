// This file contains constants and functions used in the e2e tests.

import puppeteer, { Browser, Page } from "puppeteer";

export const launchBrowser = async (): Promise<Browser> => {
  const browser = await puppeteer.launch(BROWSER_OPTIONS);

  if (!browser) {
    throw new Error("Failed launching browser.");
  }
  return browser;
};

export const BASE_URL = "http://localhost:3000";
// URL for testing
export const URL_COLL_CREATE = `${BASE_URL}/collections/create`;
// Browser's user data directory
export const USER_DATA_DIR = "/home/mpa/projects/letswap/tests/e2e/user-data";
// Browser's options
export const BROWSER_OPTIONS = {
  headless: false,
  userDataDir: USER_DATA_DIR,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  ignoreDefaultArgs: ["--enable-automation"],
};
export const PAGE_WAIT_TIMEOUT = 10e3; // 10 seconds
export const PAGE_NAVIGATION_TIMEOUT = 15e3; // 15 seconds
export const PAGE_WAIT_OPTIONS = {
  timeout: PAGE_WAIT_TIMEOUT,
  waitUntil: "networkidle0",
};
export const PAGE_NAVIGATION_OPTIONS = {
  timeout: PAGE_NAVIGATION_TIMEOUT,
  waitUntil: "networkidle0",
};
export const PAGE_WAIT_FOR_SELECTOR_OPTIONS = {
  timeout: PAGE_WAIT_TIMEOUT,
  visible: true,
  hidden: false,
};

// Remove  auto generated nextjs elements used in development environment. The element may abstruct the HTML element that currently being tested.
export async function removeAllDevelopmentElements(page: Page) {
  // Element `nextjs-portal`, used by nextjs for development panel, may be obstructing elements on the page
  // Remove element `nextjs-portal`, so it's blocking the tested page components
  await page.evaluate(() => {
    const nextJsPanel = document.querySelector("nextjs-portal");
    if (nextJsPanel && nextJsPanel.parentNode) {
      nextJsPanel.parentNode.removeChild(nextJsPanel);
    }
  });
}

// Wait for 45 seconds, just below the default test timeout (48 seconds)
export async function wait45Seconds() {
  return new Promise((r) => setTimeout(r, 45e3));
}

// Wait for some duration of time
export async function waitForSomeMiliseconds(miliseconds: number) {
  return new Promise((r) => setTimeout(r, miliseconds));
}
