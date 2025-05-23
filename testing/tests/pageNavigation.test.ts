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
 * Tests related to page navigation.
 */
describe("Page Navigation", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Go to Setlist Search page", async () => {
        const setlistSearchBut = await page.waitForSelector("#go-to-setlist-search-btn");
        await Promise.all([setlistSearchBut.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/setlist-search");
    }, 10000);

    it("Logo navigates to Landing page", async () => {
        const logo = await page.waitForSelector("#site-logo");
        await Promise.all([logo.click(), page.waitForNavigation()]);
        expect(page.url()).toBe("http://localhost:3000/");
    }, 10000);

    it("Go to AI Generate Setlist page", async () => {
        const generateSetlistBut = await page.waitForSelector("#go-to-ai-generate-setlist-btn");
        await Promise.all([generateSetlistBut.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/ai-generate-setlist");
    }, 10000);

    it("Title navigates to Landing page", async () => {
        const title = await page.waitForSelector("#site-title");
        await Promise.all([title.click(), page.waitForNavigation()]);
        expect(page.url()).toBe("http://localhost:3000/");
    }, 10000);

    it("Go to About + Support page", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const aboutSupportLink = await page.waitForSelector("#about-support-link");
        await Promise.all([aboutSupportLink.click(), page.waitForNavigation()]);
        await delay(500);
        expect(page.url()).toContain("/about");
    }, 10000);

    it("Go to Privacy Policy page", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const privacyPolicyLink = await page.waitForSelector("#privacy-policy-link");
        await Promise.all([privacyPolicyLink.click(), page.waitForNavigation()]);
        await delay(500);
        expect(page.url()).toContain("/privacy-policy");
    }, 10000);

    it("Go to User Playlists page", async () => {
        await login(page);
        const accountBtn = await page.waitForSelector("#account-btn");
        await accountBtn.click();
        await delay(400);
        const userPlaylistsBtn = await page.waitForSelector("#go-to-user-playlists-btn");
        await Promise.all([userPlaylistsBtn.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/user-playlists");
    }, 10000);

    it("Go to 404 Page", async () => {
        await Promise.all([page.goto("http://localhost:3000/madeuppage"), page.waitForNavigation()]);
        const pageTitle = await page.waitForSelector("#not-found-page-title");
        expect(pageTitle).toBeDefined();
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
