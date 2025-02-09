import * as puppeteer from "puppeteer";

import { delay, launch } from "../utils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

describe("Choosing Setlist -", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await Promise.all([page.goto("http://localhost:3000/setlist-search"), page.waitForNavigation()]);
    }, 20000);

    it("Setlist Choice Blocks appear", async () => {
        // TODO: Implement test
    }, 10000);

    it("Setlist Choice Block can be selected", async () => {
        // TODO: Implement test
    }, 10000);

    it("Setlist gets opened", async () => {
        // TODO: Implement test
    }, 10000);

    it("Back To List button removes setlist", async () => {
        // TODO: Implement test
    }, 10000);

    it("Setlist Choice Block can still be selected", async () => {
        // TODO: Implement test
    }, 10000);

    it("Setlist gets opened again", async () => {
        // TODO: Implement test
    }, 10000);

    it("Choosing different setlist changes contents of setlist component", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can't open setlist with 0 songs", async () => {
        // TODO: Implement test
    }, 10000);

    it("Load More button loads more setlists", async () => {
        // TODO: Implement test
    }, 10000);

    it("Load More button is removed if there are no more setlists", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await browser.close();
    }, 10000);
});
