/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch, resetSettings } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to site settings.
 */
describe("Settings", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Settings panel can be opened", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const settingsPanel = await page.waitForSelector("#settings-panel");
        expect(settingsPanel).toBeDefined();
    }, 10000);

    it("Settings panel can be closed using close button", async () => {
        const closeBtn = await page.waitForSelector("#close-settings-btn");
        await closeBtn.click();
        await delay(500);
        const settingsPanel = await page.$("#settings-panel");
        expect(settingsPanel).toBeNull();
    }, 10000);

    it("Settings panel can be re-opened", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const settingsPanel = await page.waitForSelector("#settings-panel");
        expect(settingsPanel).toBeDefined();
    }, 10000);

    it("Settings panel can be closed by clicking outside of settings panel", async () => {
        await page.mouse.click(10, 10);
        await delay(500);
        const settingsPanel = await page.$("#settings-panel");
        expect(settingsPanel).toBeNull();
    }, 10000);

    it("Theme", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const themeSelect = await page.waitForSelector("#theme-select");
        await themeSelect.select("light");
        await delay(500);
        let themeClass = await page.evaluate((): boolean => document.documentElement.classList.contains("light"));
        expect(themeClass).toBe(true);
        await themeSelect.select("dark");
        await delay(500);
        themeClass = await page.evaluate((): boolean => document.documentElement.classList.contains("dark"));
        expect(themeClass).toBe(true);
        await themeSelect.select("system");
        await delay(500);
        themeClass = await page.evaluate(
            (): boolean =>
                document.documentElement.classList.contains("light") ||
                document.documentElement.classList.contains("dark")
        );
        expect(themeClass).toBe(true);
    }, 10000);

    it("Hide Empty Setlists", async () => {
        // TODO: Implement test
        
    }, 10000);

    it("Filter by Country", async () => {
        // TODO: Implement test
    }, 10000);

    it("Hide Songs Not Found", async () => {
        // TODO: Implement test
    }, 10000);

    it("Exclude Covers", async () => {
        // TODO: Implement test
    }, 10000);

    it("Exclude Duplicate Songs", async () => {
        // TODO: Implement test
    }, 10000);

    it("Exclude Songs Played on Tape", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
