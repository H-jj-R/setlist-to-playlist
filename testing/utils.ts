/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { log } from "console";
import * as puppeteer from "puppeteer";

/**
 * Launches a Puppeteer Browser and Page object
 * @returns {Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }>} Launched Puppeteer Browser and Page objects
 */
export async function launch(): Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }> {
    // Launch browser and page with settings
    const browser: puppeteer.Browser = await puppeteer.launch({
        args: ["--no-sandbox", "--start-maximized"],
        devtools: false,
        headless: "new",
        ignoreDefaultArgs: ["--disable-extensions"],
        slowMo: 10
    });
    const page: puppeteer.Page = await browser.newPage();
    page.setDefaultTimeout(400000);
    page.setDefaultNavigationTimeout(20000);
    await page.setViewport({ height: 720, width: 1280 });
    log("Browser launch successful");

    // Go to the site and wait for navigation
    await Promise.all([page.goto("http://localhost:3000/"), page.waitForNavigation()]);
    log("URL redirect successful");

    return { browser, page };
}

/**
 * Resets the settings of the site to defaults
 * @param page Puppeteer Page object
 */
export async function resetSettings(page: puppeteer.Page): Promise<void> {
    // Open settings
    const settingsBut = await page.waitForSelector("#settings-btn");
    settingsBut.click();
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
    await delay(1000);
}

/**
 * Delays the execution of code
 * @param {number} time - Time to delay in milliseconds
 * @returns {Promise<void>} Promise that resolves after the delay
 */
export async function delay(time: number): Promise<void> {
    return new Promise((resolve): void => {
        setTimeout(resolve, time);
    });
}
