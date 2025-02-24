/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { log } from "console";
import * as puppeteer from "puppeteer";

/**
 * Launches a Puppeteer Browser and Page object.
 *
 * @returns {Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }>} Launched Puppeteer Browser and Page objects.
 */
export async function launch(): Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }> {
    // Launch browser and page with settings
    const browser: puppeteer.Browser = await puppeteer.launch({
        args: ["--no-sandbox", "--start-maximized"],
        devtools: false,
        headless: "new",
        ignoreDefaultArgs: ["--disable-extensions"],
        slowMo: 5
    });
    const page: puppeteer.Page = await browser.newPage();
    page.setDefaultTimeout(500000);
    page.setDefaultNavigationTimeout(20000);
    await page.setViewport({ height: 720, width: 1280 });

    // Go to the site and wait for navigation
    await Promise.all([page.goto("http://localhost:3000/"), page.waitForNavigation()]);

    return { browser, page };
}

/**
 * Resets the settings of the site to defaults.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 */
export async function resetSettings(page: puppeteer.Page): Promise<void> {
    // Open settings
    const settingsBut = await page.waitForSelector("#settings-btn");
    await settingsBut.click();
    await delay(500);
    // Theme - dark by default
    const themeSelect = await page.waitForSelector("#theme-select");
    await themeSelect.select("dark");
    // Hide empty setlists - false by default
    const hesCheckbox = await page.waitForSelector("#hide-empty-setlists-checkbox");
    const hesIsChecked = await page.evaluate((el: HTMLInputElement): boolean => el.checked, hesCheckbox);
    if (hesIsChecked) await hesCheckbox.click();
    // Filter by country - no filter by default
    const countrySelect = await page.waitForSelector("#country-select");
    await countrySelect.select("");
    // Hide songs not found - false by default
    const hsnfCheckbox = await page.waitForSelector("#hide-songs-not-found-checkbox");
    const hsnfIsChecked = await page.evaluate((el: HTMLInputElement): boolean => el.checked, hsnfCheckbox);
    if (hsnfIsChecked) await hsnfCheckbox.click();
    // Exclude covers - false by default
    const ecCheckbox = await page.waitForSelector("#exclude-covers-checkbox");
    const ecChecked = await page.evaluate((el: HTMLInputElement): boolean => el.checked, ecCheckbox);
    if (ecChecked) await ecCheckbox.click();
    // Exclude duplicate songs - false by default
    const edCheckbox = await page.waitForSelector("#exclude-duplicate-songs-checkbox");
    const edChecked = await page.evaluate((el: HTMLInputElement): boolean => el.checked, edCheckbox);
    if (edChecked) await edCheckbox.click();
    // Exclude songs played on tape - false by default
    const etCheckbox = await page.waitForSelector("#exclude-played-on-tape-checkbox");
    const etChecked = await page.evaluate((el: HTMLInputElement): boolean => el.checked, etCheckbox);
    if (etChecked) await etCheckbox.click();
    // Close settings
    const closeBut = await page.waitForSelector("#close-settings-btn");
    closeBut.click();
    await delay(500);
}

/**
 * Clears an input field.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 * @param {puppeteer.ElementHandle<Element>} input - Input field to clear.
 */
export async function clearInput(page: puppeteer.Page, input: puppeteer.ElementHandle<Element>): Promise<void> {
    await input.click({ clickCount: 3 });
    await page.keyboard.press("Backspace");
}

/**
 * Delays the execution of code.
 *
 * @param {number} time - Time to delay in milliseconds.
 */
export async function delay(time: number): Promise<void> {
    return new Promise((resolve): void => {
        setTimeout(resolve, time);
    });
}
