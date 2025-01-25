import * as puppeteer from "puppeteer";
import { log } from "console";

export async function launch(): Promise<{ browser: puppeteer.Browser; page: puppeteer.Page }> {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 25,
        devtools: false,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--no-sandbox", "--start-maximized"]
    });
    const page = await browser.newPage();
    await page.setDefaultTimeout(400000);
    await page.setDefaultNavigationTimeout(20000);
    await page.setViewport({ width: 1280, height: 720 });
    log("Browser launch successful");

    await Promise.all([page.goto("http://localhost:3000/"), page.waitForNavigation()]);

    log("URL redirect successful");

    return { browser, page };
}
