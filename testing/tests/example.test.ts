import * as puppeteer from "puppeteer";
import { log } from "console";
import { launch, delay } from "../utils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

describe("Example -", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Example test", async () => {
        await delay(5000);
        expect(true).toBe(true);
    }, 10000);

    afterAll(async () => {
        await browser.close();
    }, 10000);
});
