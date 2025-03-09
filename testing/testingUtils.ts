/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

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
        headless: true,
        ignoreDefaultArgs: ["--disable-extensions"],
        slowMo: 5
    });
    const page: puppeteer.Page = await browser.newPage();
    page.setDefaultTimeout(500000);
    page.setDefaultNavigationTimeout(20000);
    await page.setViewport({ height: 720, width: 1280 });

    // Go to the site and wait for navigation
    await Promise.all([page.goto("http://localhost:3000/"), page.waitForNavigation()]);
    await delay(100);

    return { browser, page };
}

/**
 * Resets the settings of the site to defaults.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 */
export async function resetSettings(page: puppeteer.Page): Promise<void> {
    await setSetting(page, async () => {
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
    });
}

/**
 * Runs a provided function to set any setting, by opening then closing the settings tab.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 * @param {Function} settingFunction - Function to run in order to change any settings.
 */
export async function setSetting(page: puppeteer.Page, settingFunction: () => Promise<void>): Promise<void> {
    // Open settings
    const settingsBut = await page.waitForSelector("#settings-btn");
    await settingsBut.click();
    await delay(400);
    // Run provided settings change function
    await settingFunction();
    // Close settings
    const closeBtn = await page.waitForSelector("#close-settings-btn");
    await closeBtn.click();
    await delay(400);
}

/**
 * Clears input fields.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 * @param {puppeteer.ElementHandle<Element>[]} inputs - Input fields to clear.
 */
export async function clearInputs(page: puppeteer.Page, inputs: puppeteer.ElementHandle<Element>[]): Promise<void> {
    for (let input of inputs) {
        await input.click({ clickCount: 3 });
        await page.keyboard.press("Backspace");
    }
}

/**
 * Logs test user into system.
 *
 * @param {puppeteer.Page} page - Puppeteer Page object.
 */
export async function login(page: puppeteer.Page): Promise<void> {
    const loginBtn = await page.waitForSelector("#login-btn");
    await loginBtn.click();
    await page.waitForSelector("#login-dialog");
    const submitBtn = await page.waitForSelector("#submit-btn");
    const emailInput = await page.waitForSelector("#email-input");
    const passwordInput = await page.waitForSelector("#password-input");
    await emailInput.type("tester@setlisttoplaylist.com");
    await passwordInput.type("TesterPassword123!");
    await submitBtn.click();
    await page.waitForSelector("#account-btn");
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
