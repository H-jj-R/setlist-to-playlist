/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to exporting setlists.
 */
describe("Export Setlist", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("'Export' button appears on setlist searched by setlist.fm link", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Combine & Export All' button appears on list of setlists", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Export' button appears on chosen setlist", async () => {
        // TODO: Implement tests
    }, 10000);

    it("Clicking on 'Export' button opens Export dialog", async () => {
        // TODO: Implement tests
    }, 10000);

    it("Export dialog displays songs from Spotify", async () => {
        // TODO: Implement tests
    }, 10000);

    // TODO: More test cases

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
