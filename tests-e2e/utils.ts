// This file contains constants and functions used in the e2e tests.
export const BASE_URL = "http://localhost:3000";
export const USER_DATA_DIR = "/home/mpa/projects/letswap/tests-e2e/user-data";
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
