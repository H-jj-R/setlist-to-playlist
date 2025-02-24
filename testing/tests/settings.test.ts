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

    describe("Settings panel", () => {
        it("Settings panel can be opened", async () => {
            // TODO: Implement test
        }, 10000);

        it("Settings panel can be closed using close button", async () => {
            // TODO: Implement test
        }, 10000);

        it("Settings panel can be closed by clicking outside of settings panel", async () => {
            // TODO: Implement test
        }, 10000);
    });

    it("Theme", async () => {
        // TODO: Implement test
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
