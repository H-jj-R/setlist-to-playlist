/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInputs, delay, launch } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to exporting setlists.
 */
describe("Export Setlist", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await Promise.all([page.goto("http://localhost:3000/setlist-search"), page.waitForNavigation()]);
    }, 20000);

    it("'Export' button appears on setlist searched by setlist.fm link", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        const searchButton = await page.waitForSelector("#search-btn");
        await clearInputs(page, [searchInput]);
        await searchInput.type(
            "https://www.setlist.fm/setlist/the-beatles/1969/apple-corps-rooftop-london-england-53d6f3ad.html"
        );
        await searchButton.click();
        await page.waitForSelector("#setlist-display");
        const exportBtn = await page.waitForSelector("#export-spotify-btn");
        expect(exportBtn).toBeDefined();
    }, 10000);

    it("Export dialog on setlist searched by setlist.fm link can be opened", async () => {
        const exportBtn = await page.waitForSelector("#export-spotify-btn");
        await exportBtn.click();
        const exportDialog = await page.waitForSelector("#export-dialog");
        expect(exportDialog).toBeDefined();
    }, 10000);

    it("Playlist Name field is pre-filled correctly on setlist searched by setlist.fm link", async () => {
        const nameInput = await page.waitForSelector("#playlist-name-input");
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, nameInput);
        expect(value).toContain("The Beatles Setlist");
    }, 10000);

    it("Export dialog on setlist searched by setlist.fm link can be closed", async () => {
        const closeBtn = await page.waitForSelector("#cancel-btn");
        await closeBtn.click();
        const exportDialog = await page.$("#export-dialog");
        expect(exportDialog).toBeNull();
    }, 10000);

    it("'Combine & Export All' button appears on list of setlists", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        await searchInput.type("2Pac");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        const combineExportBtn = await page.waitForSelector("#combine-export-btn");
        expect(combineExportBtn).toBeDefined();
    }, 10000);

    it("Export dialog on 'Combine & Export All' can be opened", async () => {
        const combineExportBtn = await page.waitForSelector("#combine-export-btn");
        await combineExportBtn.click();
        const exportDialog = await page.waitForSelector("#export-dialog");
        expect(exportDialog).toBeDefined();
    }, 10000);

    it("Playlist Name field is pre-filled correctly on 'Combine & Export All'", async () => {
        const nameInput = await page.waitForSelector("#playlist-name-input");
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, nameInput);
        expect(value).toContain("2Pac Setlist");
        expect(value).toContain("Combined");
    }, 10000);

    it("Export dialog on 'Combine & Export All' can be closed", async () => {
        const closeBtn = await page.waitForSelector("#cancel-btn");
        await closeBtn.click();
        const exportDialog = await page.$("#export-dialog");
        expect(exportDialog).toBeNull();
    }, 10000);

    it("'Export' button appears on chosen setlist", async () => {
        const setlistChoiceBlock = await page.waitForSelector("li[id^='setlist-item-']");
        await setlistChoiceBlock.click();
        await page.waitForSelector("#setlist-display");
        const exportBtn = await page.waitForSelector("#export-spotify-btn");
        expect(exportBtn).toBeDefined();
    }, 10000);

    it("Clicking on 'Export' button opens Export dialog", async () => {
        const exportBtn = await page.waitForSelector("#export-spotify-btn");
        await exportBtn.click();
        const exportDialog = await page.waitForSelector("#export-dialog");
        expect(exportDialog).toBeDefined();
    }, 10000);

    it("Playlist Name field is pre-filled correctly for selected setlist", async () => {
        const nameInput = await page.waitForSelector("#playlist-name-input");
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, nameInput);
        expect(value).toContain("2Pac Setlist");
    }, 10000);

    it("Export dialog displays a list of songs from Spotify", async () => {
        const songList = await page.waitForSelector("#exported-setlist-container");
        expect(songList).toBeDefined();
    }, 10000);

    it("Can type in Playlist Name field", async () => {
        const testInput = "Test input";
        const nameInput = await page.waitForSelector("#playlist-name-input");
        await clearInputs(page, [nameInput]);
        await nameInput.type(testInput);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, nameInput);
        expect(value).toContain(testInput);
    }, 10000);

    it("Can type in Playlist Description field", async () => {
        const testInput = "Test input";
        const descInput = await page.waitForSelector("#playlist-description-input");
        await descInput.type(testInput);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, descInput);
        expect(value).toContain(testInput);
    }, 10000);

    it("Songs on export list can be selected to be excluded", async () => {
        await page.waitForSelector("li[id^='export-song-item-']");
        const songItems = await page.$$("li[id^='export-song-item-']");
        await songItems[0].click();
        const isExcluded = await page.evaluate((el): boolean => {
            return el.classList.contains("opacity-20");
        }, songItems[0]);
        expect(isExcluded).toBe(true);
    }, 10000);

    it("Excluded Songs on export list can be selected again to be included", async () => {
        const songItems = await page.$$("li[id^='export-song-item-']");
        await songItems[0].click();
        const isExcluded = await page.evaluate((el): boolean => {
            return el.classList.contains("opacity-20");
        }, songItems[0]);
        expect(isExcluded).toBe(false);
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
