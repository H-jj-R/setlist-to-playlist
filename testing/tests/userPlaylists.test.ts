/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch, login, resetSettings } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to user playlists.
 */
describe("User Playlists", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
        await login(page);
    }, 20000);

    it("Login to site makes account settings panel appear", async () => {
        // TODO: Implement test
    }, 10000);

    it("Account settings panel can be opened", async () => {
        // TODO: Implement test
    }, 10000);

    it("User playlists are empty", async () => {
        // TODO: Implement test
    }, 10000);

    it("Exporting setlist adds it to user playlists page", async () => {
        // TODO: Implement test
    }, 10000);

    it("Expanding playlist loads then displays songs in that playlist", async () => {
        // TODO: Implement test
    }, 10000);

    it("Collapsing playlist hides songs in that playlist", async () => {
        // TODO: Implement test
    }, 10000);

    it("Edit icon button opens editing mode", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cancel button closes editing mode", async () => {
        // TODO: Implement test
    }, 10000);

    it("Edit icon button re-opens editing mode", async () => {
        // TODO: Implement test
    }, 10000);

    it("Name field contains existing name", async () => {
        // TODO: Implement test
    }, 10000);

    it("Description field contains existing description", async () => {
        // TODO: Implement test
    }, 10000);

    it("Name field can be edited", async () => {
        // TODO: Implement test
    }, 10000);

    it("Description field can be edited", async () => {
        // TODO: Implement test
    }, 10000);

    it("Submitting with empty name isn't allowed", async () => {
        // TODO: Implement test
    }, 10000);

    it("Submitting with valid name and description shows success message", async () => {
        // TODO: Implement test
    }, 10000);

    it("Name and description are updated", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Recover' button recovers playlist on Spotify", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Delete' button deletes playlist from user playlists", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
