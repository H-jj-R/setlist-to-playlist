/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInput, launch, resetSettings } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to setlist search.
 */
describe("Setlist Search -", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
        await Promise.all([page.goto("http://localhost:3000/setlist-search"), page.waitForNavigation()]);
    }, 20000);

    it("Can type in search bar", async () => {
        const inputTest = "My test input";
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, searchInput);
        expect(value).toBe(inputTest);
    }, 10000);

    it("Pressing Search with empty search query does nothing", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInput(page, searchInput);
        const searchButton = await page.waitForSelector("#search-btn");
        const initialContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        const finalContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Pressing Search with valid search query triggers search", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type("Metallica");
        const searchButton = await page.waitForSelector("#search-btn");
        const initialContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        const finalContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).not.toBe(initialContent);
    }, 10000);

    it("Query is added to URL param", async () => {
        expect(page.url()).toContain("q=Metallica");
    }, 10000);

    it("Can view a list of setlists", async () => {
        const listOfSetlists = await page.waitForSelector("#list-of-setlists");
        expect(listOfSetlists).toBeDefined();
    }, 60000);

    it("Searching a different query triggers search", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInput(page, searchInput);
        await searchInput.type("Oasis");
        const searchButton = await page.waitForSelector("#search-btn");
        const initialContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        const finalContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content after clicking
        await page.waitForSelector("#list-of-setlists");
        expect(finalContent).not.toBe(initialContent);
    }, 60000);

    it("Query is updated in URL param", async () => {
        expect(page.url()).toContain("q=Oasis");
    }, 10000);

    it("Searching same query doesn't trigger search", async () => {
        await page.waitForSelector("#list-of-setlists");
        const searchButton = await page.waitForSelector("#search-btn");
        const initialContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        const finalContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Searching with empty query after a query has been performed doesn't refresh query", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        const searchButton = await page.waitForSelector("#search-btn");
        await clearInput(page, searchInput);
        const initialContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content before clicking
        await searchButton.click();
        const finalContent = await page.evaluate(() => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    afterAll(async () => {
        await browser.close();
    }, 10000);
});
