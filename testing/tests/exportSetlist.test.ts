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
 * Tests related to exporting setlists.
 */
describe("Export Setlist", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Test", async () => {
        // TODO: Implement tests
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
