import { log } from "console";
import * as puppeteer from "puppeteer";

export async function launch(): Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }> {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--start-maximized"],
        devtools: false,
        headless: false,
        ignoreDefaultArgs: ["--disable-extensions"],
        slowMo: 25
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(400000);
    await page.setDefaultNavigationTimeout(20000);
    await page.setViewport({ height: 720, width: 1280 });
    log("Browser launch successful");

    await Promise.all([page.goto("http://localhost:3000/"), page.waitForNavigation()]);

    log("URL redirect successful");

    return { browser, page };
}
