/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInputs, delay, launch, login } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to AI generated setlists.
 */
describe("AI Generated Setlists", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Go to AI generate setlist page", async () => {
        const generateSetlistBtn = await page.waitForSelector("#go-to-ai-generate-setlist-btn");
        await Promise.all([generateSetlistBtn.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/ai-generate-setlist");
    }, 10000);

    it("If user isn't logged in, show 'Authentication Required'", async () => {
        const authDialog = await page.waitForSelector("#auth-required-message");
        expect(authDialog).toBeDefined();
    }, 10000);

    it("Can log in from AI generate setlist page", async () => {
        await login(page);
        const accountBtn = await page.waitForSelector("#account-btn");
        expect(accountBtn).toBeDefined();
    }, 10000);

    it("If user is logged in, doesn't show 'Authentication Required'", async () => {
        const authDialog = await page.$("#auth-required-message");
        expect(authDialog).toBeNull();
    }, 10000);

    it("Can type in search bar", async () => {
        const inputTest = "Test input";
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, searchInput);
        expect(value).toBe(inputTest);
    }, 10000);

    it("Pressing Search with empty search query does nothing", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        const searchButton = await page.waitForSelector("#search-btn");
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Pressing Search with valid search query triggers search", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type("Tool");
        const searchButton = await page.waitForSelector("#search-btn");
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).not.toBe(initialContent);
    }, 10000);

    it("Searching a valid query locks the search bar", async () => {
        const isDisabled = await page.evaluate((): boolean => {
            const button: HTMLButtonElement = document.querySelector("#search-btn");
            return button ? button.disabled : false;
        });
        expect(isDisabled).toBe(true);
    }, 10000);

    it("Searching a valid query shows loading bar", async () => {
        const progressIndicator = await page.waitForSelector("#progress-indicator");
        expect(progressIndicator).toBeDefined();
    }, 10000);

    it("Generates three predicted setlists", async () => {
        const setlists = await Promise.all([
            page.waitForSelector("#setlist-display-0"),
            page.waitForSelector("#setlist-display-1"),
            page.waitForSelector("#setlist-display-2")
        ]);
        setlists.forEach((setlist): void => expect(setlist).toBeDefined());
    }, 30000);

    it("Each 'Export to Spotify' button opens export dialog", async () => {
        const exportBtns = await Promise.all([
            page.waitForSelector("#setlist-display-0 #export-spotify-btn"),
            page.waitForSelector("#setlist-display-1 #export-spotify-btn"),
            page.waitForSelector("#setlist-display-2 #export-spotify-btn")
        ]);
        for (let i = 0; i < exportBtns.length; i++) {
            await exportBtns[i].click();
            const exportDialog = await page.waitForSelector("#export-dialog");
            expect(exportDialog).toBeDefined();
            const cancelBtn = await page.waitForSelector("#cancel-btn");
            await cancelBtn.click();
        }
    }, 10000);

    it("'Combine & Export' button opens export dialog", async () => {
        const combineExportBtn = await page.waitForSelector("#combine-export-btn");
        await combineExportBtn.click();
        const exportDialog = await page.waitForSelector("#export-dialog");
        expect(exportDialog).toBeDefined();
        const cancelBtn = await page.waitForSelector("#cancel-btn");
        await cancelBtn.click();
    }, 10000);

    it("Searching same query doesn't trigger search", async () => {
        const searchButton = await page.waitForSelector("#search-btn");
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Searching with empty query after a query has been performed doesn't refresh query", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        const searchButton = await page.waitForSelector("#search-btn");
        await clearInputs(page, [searchInput]);
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Searching a different query triggers search", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type("Oasis");
        const searchButton = await page.waitForSelector("#search-btn");
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).not.toBe(initialContent);
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
