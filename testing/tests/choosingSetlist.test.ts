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
 * Tests related to choosing a setlist after a valid query has been entered.
 */
describe("Choosing Setlist", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await Promise.all([page.goto("http://localhost:3000/setlist-search"), page.waitForNavigation()]);
    }, 20000);

    it("Setlist Choice Blocks appear when valid query is entered", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type("Metallica");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        const setlistChoiceBlocks = await page.waitForSelector("#setlist-list");
        expect(setlistChoiceBlocks).toBeDefined();
    }, 30000);

    it("Setlist Choice Block can be selected and setlist gets opened", async () => {
        const item = await page.waitForSelector("[id^=setlist-item-]");
        await item.click();
        const setlist = await page.waitForSelector("#setlist-display");
        expect(setlist).toBeDefined();
    }, 10000);

    it("Back To List button removes setlist", async () => {
        const backBtn = await page.waitForSelector("#back-btn");
        await backBtn.click();
        await delay(200);
        const setlist = await page.$("#setlist-display");
        expect(setlist).toBeNull();
    }, 10000);

    it("Setlist Choice Block can still be selected and setlist opens again", async () => {
        const item = await page.waitForSelector("[id^=setlist-item-]");
        await item.click();
        const setlist = await page.waitForSelector("#setlist-display");
        expect(setlist).toBeDefined();
    }, 10000);

    it("Choosing same setlist doesn't change contents of setlist component", async () => {
        const item = await page.waitForSelector("[id^=setlist-item-]");
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await item.click();
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).toBe(initialContent);
    }, 10000);

    it("Choosing different setlist changes contents of setlist component", async () => {
        const items = await page.$$("[id^=setlist-item-]");
        expect(items.length).toBeGreaterThan(1);
        await delay(200);
        const initialContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content before clicking
        await items[1].click();
        await page.waitForSelector("#setlist-display");
        await delay(200);
        const finalContent = await page.evaluate((): string => document.body.innerHTML); // Capture the page content after clicking
        expect(finalContent).not.toBe(initialContent);
    }, 10000);

    it("Can't open setlist with 0 songs", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        await searchInput.type("Heriot");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        const items = await page.$$("[id^=setlist-item-]");
        for (const item of items) {
            if (!(await item.$("#setlist-song-count"))) {
                await item.click();
                break;
            }
        }
        await delay(200);
        const setlist = await page.$("#setlist-display");
        expect(setlist).toBeNull();
    }, 10000);

    it("Load More button loads more setlists", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        await searchInput.type("Frank Ocean");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        const initialItemLength = (await page.$$("[id^=setlist-item-]")).length;
        const loadMoreBut = await page.waitForSelector("#load-more-btn");
        await loadMoreBut.click();
        await delay(2500);
        const finalItemLength = (await page.$$("[id^=setlist-item-]")).length;
        expect(finalItemLength).toBeGreaterThan(initialItemLength);
    }, 10000);

    it("Load More button is removed if there are no more setlists", async () => {
        const expectedPresses = 2;
        for (let i = 0; i < expectedPresses; i++) {
            const loadMoreBut = await page.waitForSelector("#load-more-btn");
            await loadMoreBut.click();
            await delay(2500);
        }
        const loadMoreBut = await page.$("#load-more-btn");
        expect(loadMoreBut).toBeNull();
    }, 30000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
