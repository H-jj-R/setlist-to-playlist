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
 * Tests related to the About + Support page.
 */
describe("About + Support Page", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Go to About + Support page", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in email field", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in message field", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot submit with empty email and message", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot submit with message but empty email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot submit with email but empty message", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot submit with invalid email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Typing in message field correctly updates character counter", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot type over character limit (1000)", async () => {
        // TODO: Implement test
    }, 10000);

    it("Valid email and message submits form", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Submit Another' button puts form back on page with empty fields", async () => {
        // TODO: Implement test
    }, 10000);

    it("Spotify link opens Spotify page", async () => {
        // TODO: Implement test
    }, 10000);

    it("Setlist.fm link opens setlist.fm page", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can navigate to About + Support page from Privacy Policy page", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
