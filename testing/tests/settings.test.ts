/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInputs, delay, launch, setSetting } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to site settings.
 */
describe("Settings", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Settings panel can be opened", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(400);
        const settingsPanel = await page.waitForSelector("#settings-panel");
        expect(settingsPanel).toBeDefined();
    }, 10000);

    it("Settings panel can be closed using close button", async () => {
        const closeBtn = await page.waitForSelector("#close-settings-btn");
        await closeBtn.click();
        await delay(400);
        const settingsPanel = await page.$("#settings-panel");
        expect(settingsPanel).toBeNull();
    }, 10000);

    it("Settings panel can be re-opened", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(400);
        const settingsPanel = await page.waitForSelector("#settings-panel");
        expect(settingsPanel).toBeDefined();
    }, 10000);

    it("Settings panel can be closed by clicking outside of settings panel", async () => {
        await page.mouse.click(10, 10);
        await delay(400);
        const settingsPanel = await page.$("#settings-panel");
        expect(settingsPanel).toBeNull();
    }, 10000);

    it("Theme - Light", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(400);
        const themeSelect = await page.waitForSelector("#theme-select");
        await themeSelect.select("light");
        await delay(100);
        const themeClass = await page.evaluate((): boolean => document.documentElement.classList.contains("light"));
        expect(themeClass).toBe(true);
    }, 10000);

    it("Theme - Dark", async () => {
        const themeSelect = await page.waitForSelector("#theme-select");
        await themeSelect.select("dark");
        await delay(100);
        const themeClass = await page.evaluate((): boolean => document.documentElement.classList.contains("dark"));
        expect(themeClass).toBe(true);
    }, 10000);

    it("Theme - System", async () => {
        const themeSelect = await page.waitForSelector("#theme-select");
        await themeSelect.select("system");
        await delay(100);
        const themeClass = await page.evaluate(
            (): boolean =>
                document.documentElement.classList.contains("light") ||
                document.documentElement.classList.contains("dark")
        );
        expect(themeClass).toBe(true);
        await themeSelect.select("dark");
        const closeBtn = await page.waitForSelector("#close-settings-btn");
        await closeBtn.click();
        await delay(400);
    }, 10000);

    it("Hide Empty Setlists - Number of hidden setlists gets displayed", async () => {
        const setlistSearchBtn = await page.waitForSelector("#go-to-setlist-search-btn");
        await Promise.all([setlistSearchBtn.click(), page.waitForNavigation()]);
        const searchInput = await page.waitForSelector("#search-input");
        await searchInput.type("Heriot");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#setlist-list li");
        const emptySetlistsCount: number = await page.evaluate((): number => {
            return Array.from(document.querySelectorAll("#setlist-list li")).filter((li): boolean =>
                li.querySelector("#setlist-song-count")?.textContent.includes("0 songs")
            ).length;
        });
        await setSetting(page, async () => {
            const hesCheckbox = await page.waitForSelector("#hide-empty-setlists-checkbox");
            await hesCheckbox.click();
        });
        const hiddenSetlistsMessage = await page.waitForSelector("#hidden-setlists-count");
        expect(hiddenSetlistsMessage).toBeDefined();
        const messageText = await hiddenSetlistsMessage.evaluate((el): string => el.textContent);
        expect(messageText).toContain(emptySetlistsCount.toString());
    }, 30000);

    it("Hide Empty Setlists - Empty setlists get hidden", async () => {
        const visibleEmptySetlists: number = await page.evaluate((): number => {
            return Array.from(document.querySelectorAll("#setlist-list li")).filter((li) => {
                const songCountText: string = li.querySelector("#setlist-song-count")?.textContent.trim();
                return songCountText === "0 songs" && (li as HTMLElement).offsetParent !== null;
            }).length;
        });
        expect(visibleEmptySetlists).toBe(0);
    }, 10000);

    it("Hide Empty Setlists - Turning off setting removes hidden setlists message", async () => {
        await setSetting(page, async () => {
            const hesCheckbox = await page.waitForSelector("#hide-empty-setlists-checkbox");
            await hesCheckbox.click();
        });
        const hiddenSetlistsMessage = await page.$("#hidden-setlists-count");
        expect(hiddenSetlistsMessage).toBeNull();
    }, 10000);

    it("Hide Empty Setlists - Turning off setting displays empty setlists again", async () => {
        const emptySetlistsCount: number = await page.evaluate((): number => {
            return Array.from(document.querySelectorAll("#setlist-list li")).filter((li): boolean =>
                li.querySelector("#setlist-song-count")?.textContent.includes("0 songs")
            ).length;
        });
        expect(emptySetlistsCount).toBeGreaterThan(0);
    }, 10000);

    it("Filter by Country - List of Setlists title gets updated", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        await searchInput.type("Metallica");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        let listTitle = await page.waitForSelector("#list-of-setlists-title");
        let listTitleText = await listTitle.evaluate((el): string => el.textContent);
        expect(listTitleText.includes("in")).toBeFalsy();
        await setSetting(page, async () => {
            const countrySelect = await page.waitForSelector("#country-select");
            await countrySelect.select("AU");
        });
        await page.waitForSelector("#list-of-setlists");
        listTitle = await page.waitForSelector("#list-of-setlists-title");
        listTitleText = await listTitle.evaluate((el): string => el.textContent);
        expect(listTitleText.includes("in Australia")).toBeTruthy();
    }, 30000);

    it("Filter by Country - Displayed setlists are only from selected country", async () => {
        const allSetlistsCount: number = await page.evaluate((): number => {
            return document.querySelectorAll("#setlist-list li").length;
        });
        const countrySetlistsCount: number = await page.evaluate((): number => {
            return Array.from(document.querySelectorAll("#setlist-list li")).filter((li): boolean =>
                li.querySelector("#setlist-venue")?.textContent.includes("Australia")
            ).length;
        });
        expect(countrySetlistsCount).toBe(allSetlistsCount);
    }, 10000);

    it("Filter by Country - Resetting setting makes all setlists appear", async () => {
        const filteredSetlists = await page.waitForSelector("#setlist-list");
        await setSetting(page, async () => {
            const countrySelect = await page.waitForSelector("#country-select");
            await countrySelect.select("");
        });
        const unfilteredSetlists = await page.waitForSelector("#setlist-list");
        expect(unfilteredSetlists).not.toBe(filteredSetlists);
    }, 10000);

    it("Hide Songs Not Found - Songs not found get hidden", async () => {
        const searchInput = await page.waitForSelector("#search-input");
        await clearInputs(page, [searchInput]);
        await searchInput.type("Twenty One Pilots");
        const searchButton = await page.waitForSelector("#search-btn");
        await searchButton.click();
        await page.waitForSelector("#list-of-setlists");
        await setSetting(page, async () => {
            const hsnfCheckbox = await page.waitForSelector("#hide-songs-not-found-checkbox");
            await hsnfCheckbox.click();
        });
        const exportAllBtn = await page.waitForSelector("#combine-export-btn");
        await exportAllBtn.click();
        await page.waitForSelector("#exported-setlist-tracks");
        const notFoundCount = await page.evaluate((): number => {
            return document.querySelectorAll("#exported-setlist-tracks [id^='song-not-found-']").length;
        });
        expect(notFoundCount).toBe(0);
        const closeExportBtn = await page.waitForSelector("#cancel-btn");
        await closeExportBtn.click();
    }, 30000);

    it("Hide Songs Not Found - Resetting setting displays songs not found", async () => {
        await page.waitForSelector("#list-of-setlists");
        await setSetting(page, async () => {
            const hsnfCheckbox = await page.waitForSelector("#hide-songs-not-found-checkbox");
            await hsnfCheckbox.click();
        });
        const exportAllBtn = await page.waitForSelector("#combine-export-btn");
        await exportAllBtn.click();
        await page.waitForSelector("#exported-setlist-tracks");
        const notFoundCount = await page.evaluate((): number => {
            return document.querySelectorAll("#exported-setlist-tracks [id^='song-not-found-']").length;
        });
        expect(notFoundCount).toBeGreaterThan(0);
        const closeExportBtn = await page.waitForSelector("#cancel-btn");
        await closeExportBtn.click();
    }, 10000);

    // it("Exclude Covers - Covers get excluded from export", async () => {
    //     const searchInput = await page.waitForSelector("#search-input");
    //     await clearInputs(page, [searchInput]);
    //     await searchInput.type("Kendrick Lamar");
    //     const searchButton = await page.waitForSelector("#search-btn");
    //     await searchButton.click();
    //     await page.waitForSelector("#list-of-setlists");
    //     await setSetting(page, async () => {
    //         const ecCheckbox = await page.waitForSelector("#exclude-covers-checkbox");
    //         await ecCheckbox.click();
    //     });
    //     const setlistItem = await page.waitForSelector("#setlist-item-2b5604fa");
    //     await setlistItem.click();
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const coverTrack = await page.waitForSelector("#export-song-item-593W4qZOwwdqF6YnimJjL6");
    //     const isExcluded = await page.evaluate((el): boolean => {
    //         return el.classList.contains("opacity-20");
    //     }, coverTrack);
    //     expect(isExcluded).toBe(true);
    //     const closeExportBtn = await page.waitForSelector("#cancel-btn");
    //     await closeExportBtn.click();
    // }, 15000);

    // it("Exclude Covers - Resetting setting includes covers in export", async () => {
    //     await setSetting(page, async () => {
    //         const ecCheckbox = await page.waitForSelector("#exclude-covers-checkbox");
    //         await ecCheckbox.click();
    //     });
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const coverTrack = await page.waitForSelector("#export-song-item-593W4qZOwwdqF6YnimJjL6");
    //     const isExcluded = await page.evaluate((el): boolean => {
    //         return el.classList.contains("opacity-20");
    //     }, coverTrack);
    //     expect(isExcluded).toBe(false);
    //     const closeExportBtn = await page.waitForSelector("#cancel-btn");
    //     await closeExportBtn.click();
    // }, 15000);

    // it("Exclude Duplicate Songs - Duplicate songs get excluded from export", async () => {
    //     await setSetting(page, async () => {
    //         const edCheckbox = await page.waitForSelector("#exclude-duplicate-songs-checkbox");
    //         await edCheckbox.click();
    //     });
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const duplicatesList = await page.$$("li[id^='export-song-item-6AI3ezQ4o3HUoP6Dhudph3']");
    //     const isFirstExcluded = await page.evaluate((el): boolean => {
    //         return el.classList.contains("opacity-20");
    //     }, duplicatesList[0]);
    //     expect(isFirstExcluded).toBe(false);
    //     for (let i = 1; i < duplicatesList.length; i++) {
    //         const areRestExcluded = await page.evaluate((el): boolean => {
    //             return el.classList.contains("opacity-20");
    //         }, duplicatesList[i]);
    //         expect(areRestExcluded).toBe(true);
    //     }
    //     const closeExportBtn = await page.waitForSelector("#cancel-btn");
    //     await closeExportBtn.click();
    // }, 15000);

    // it("Exclude Duplicate Songs - Resetting setting includes duplicate songs in export", async () => {
    //     await setSetting(page, async () => {
    //         const edCheckbox = await page.waitForSelector("#exclude-duplicate-songs-checkbox");
    //         await edCheckbox.click();
    //     });
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const duplicatesList = await page.$$("li[id^='export-song-item-6AI3ezQ4o3HUoP6Dhudph3']");
    //     for (let i = 0; i < duplicatesList.length; i++) {
    //         const areRestExcluded = await page.evaluate((el): boolean => {
    //             return el.classList.contains("opacity-20");
    //         }, duplicatesList[i]);
    //         expect(areRestExcluded).toBe(false);
    //     }
    //     const closeExportBtn = await page.waitForSelector("#cancel-btn");
    //     await closeExportBtn.click();
    // }, 15000);

    // it("Exclude Songs Played on Tape - Songs played on tape get excluded from export", async () => {
    //     const searchInput = await page.waitForSelector("#search-input");
    //     await clearInputs(page, [searchInput]);
    //     await searchInput.type("Sleep Token");
    //     const searchButton = await page.waitForSelector("#search-btn");
    //     await searchButton.click();
    //     await page.waitForSelector("#list-of-setlists");
    //     await setSetting(page, async () => {
    //         const etCheckbox = await page.waitForSelector("#exclude-played-on-tape-checkbox");
    //         await etCheckbox.click();
    //     });
    //     const setlistItem = await page.waitForSelector("#setlist-item-33a99035");
    //     await setlistItem.click();
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const tapeTrack = await page.waitForSelector("#export-song-item-4pbyDPjFgfPqFTcIMC8xpK");
    //     const isExcluded = await page.evaluate((el): boolean => {
    //         return el.classList.contains("opacity-20");
    //     }, tapeTrack);
    //     expect(isExcluded).toBe(true);
    //     const closeExportBtn = await page.waitForSelector("#cancel-btn");
    //     await closeExportBtn.click();
    // }, 15000);

    // it("Exclude Songs Played on Tape - Resetting setting includes songs played on tape in export", async () => {
    //     await setSetting(page, async () => {
    //         const etCheckbox = await page.waitForSelector("#exclude-played-on-tape-checkbox");
    //         await etCheckbox.click();
    //     });
    //     const exportBtn = await page.waitForSelector("#export-spotify-btn");
    //     await exportBtn.click();
    //     await page.waitForSelector("#exported-setlist-tracks");
    //     const tapeTrack = await page.waitForSelector("#export-song-item-4pbyDPjFgfPqFTcIMC8xpK");
    //     const isExcluded = await page.evaluate((el): boolean => {
    //         return el.classList.contains("opacity-20");
    //     }, tapeTrack);
    //     expect(isExcluded).toBe(false);
    // }, 15000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
