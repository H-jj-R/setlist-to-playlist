/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch, login } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to AI generated setlists.
 */
describe("AI Generated Setlists", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await login(page);
    }, 20000);

    it("Go to AI generate setlist page", async () => {
        const generateSetlistBtn = await page.waitForSelector("#go-to-ai-generate-setlist-btn");
        await Promise.all([generateSetlistBtn.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/ai-generate-setlist");
    }, 10000);

    it("If user isn't logged in, show 'Authentication Required'", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can log in from AI generate setlist page", async () => {
        // TODO: Implement test
    }, 10000);

    it("If user is logged in, doesn't show 'Authentication Required'", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in search bar", async () => {
        // TODO: Implement test
    }, 10000);

    it("Pressing Search with empty search query does nothing", async () => {
        // TODO: Implement test
    }, 10000);

    it("Pressing Search with valid search query triggers search and locks search bar", async () => {
        // TODO: Implement test
    }, 10000);

    it("Generates three predicted setlists", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
