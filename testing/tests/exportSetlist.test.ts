/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to exporting setlists.
 */
describe("Export Setlist", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("'Export' button appears on setlist searched by setlist.fm link", async () => {
        // TODO: Implement test
    }, 10000);

    it("Export dialog on setlist searched by setlist.fm link can be opened", async () => {
        // TODO: Implement test
    }, 10000);

    it("Playlist Name field is pre-filled correctly on setlist searched by setlist.fm link", async () => {
        // TODO: Implement test
    }, 10000);

    it("Export dialog on setlist searched by setlist.fm link can be closed", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Combine & Export All' button appears on list of setlists", async () => {
        // TODO: Implement test
    }, 10000);

    it("Export dialog on 'Combine & Export All' can be opened", async () => {
        // TODO: Implement test
    }, 10000);

    it("Playlist Name field is pre-filled correctly on 'Combine & Export All'", async () => {
        // TODO: Implement test
    }, 10000);

    it("Export dialog on 'Combine & Export All' can be closed", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Export' button appears on chosen setlist", async () => {
        // TODO: Implement test
    }, 10000);

    it("Clicking on 'Export' button opens Export dialog", async () => {
        // TODO: Implement test
    }, 10000);

    it("Export dialog displays a list of songs from Spotify", async () => {
        // TODO: Implement test
    }, 10000);

    it("Playlist Name field is pre-filled correctly for selected setlist", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in Playlist Name field", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in Playlist Description field", async () => {
        // TODO: Implement test
    }, 10000);

    it("Songs on export list can be selected to be excluded", async () => {
        // TODO: Implement test
    }, 10000);

    it("Excluded Songs on export list can be selected again to be included", async () => {
        // TODO: Implement test
    }, 10000);

    it("Clicking dropzone opens file chooser", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
