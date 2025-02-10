import * as puppeteer from "puppeteer";

import { launch } from "../utils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

describe("Page Navigation -", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Landing Page to Setlist Search", async () => {
        const setlistSearchBut = await page.waitForSelector("#go-to-setlist-search-btn");
        await Promise.all([setlistSearchBut.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/setlist-search");
    }, 10000);

    it("Logo navigates to Landing Page", async () => {
        const logo = await page.waitForSelector("#site-logo");
        await Promise.all([logo.click(), page.waitForNavigation()]);
        expect(page.url()).toBe("http://localhost:3000/");
    }, 10000);

    it("Landing Page to AI Generate Setlist", async () => {
        const generateSetlistBut = await page.waitForSelector("#go-to-ai-generate-setlist-btn");
        await Promise.all([generateSetlistBut.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/ai-generate-setlist");
    }, 10000);

    it("Title navigates to Landing Page", async () => {
        const title = await page.waitForSelector("#site-title");
        await Promise.all([title.click(), page.waitForNavigation()]);
        expect(page.url()).toBe("http://localhost:3000/");
    }, 10000);

    it("Go to 404 Page", async () => {
        // TODO: Improve 404 page before writing test
    }, 10000);

    it("Go to 500 Page", async () => {
        // TODO: Improve 500 page before writing test
    }, 10000);

    afterAll(async () => {
        await browser.close();
    }, 10000);
});
