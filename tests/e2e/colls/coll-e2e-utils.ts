// This file contains helpers for e2e collection related tests

import { Page } from "puppeteer";

/**
 * Fill in collection formData, assumed the `Page` already navigated to the form URL
 * @param page
 * @param collFormData
 */
export async function fillCollectionForm(page: Page, collFormData: FormData) {
  // Fill the data to the form
  for (const [fieldName, fieldValue] of collFormData.entries()) {
    await page.type(`#coll-form [name='${fieldName}']`, fieldValue.toString());
    // If the filedName == "producerId", select the option
    if (fieldName === "producerId") {
      await page.select(
        `#coll-form [name='${fieldName}']`,
        fieldValue.toString()
      );
    }
  }
}
