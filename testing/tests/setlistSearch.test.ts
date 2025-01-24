import * as puppeteer from "puppeteer";
import { launch, delay } from "../utils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

describe("Setlist Search -", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await Promise.all([page.goto("http://localhost:3000/setlist-search"), page.waitForNavigation()]);
    }, 20000);

    it("Can type in search bar", async () => {
        // TODO: Implement test
    }, 10000);

    it("Pressing Search with empty search query does nothing", async () => {
        // TODO: Implement test
    }, 10000);

    it("Pressing Search with valid search query triggers search", async () => {
        // TODO: Implement test
    }, 10000);

    it("Query is added to URL param", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can view a list of setlists", async () => {
        // TODO: Implement test
    }, 10000);

    it("Searching a different query triggers search", async () => {
        // TODO: Implement test
    }, 10000);

    it("Query is updated in URL param", async () => {
        // TODO: Implement test
    }, 10000);

    it("Searching same query doesn't trigger search", async () => {
        // TODO: Implement test
    }, 10000);

    it("Searching with empty query after a query has been performed doesn't refresh query", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await browser.close();
    }, 10000);
});
