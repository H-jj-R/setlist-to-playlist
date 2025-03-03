/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { delay, launch, resetSettings } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to user logging in and logging out.
 */
describe("Login", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Can open Login / Sign Up dialog", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Forgot Password' link opens Forgot Password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can go back to Login using 'Back to Login' link", async () => {
        // TODO: Implement test
    }, 10000);

    it("'No account?' link opens Signup", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can go back to Login using 'Already have an account?' link", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in email field", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in password field", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Show' button shows password input to user", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Hide' button hides password input from user", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login with blank inputs", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login with blank password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login with blank email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login with invalid email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login with incorrect password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can login with valid details", async () => {
        // TODO: Implement test
    }, 10000);

    it("Logging in shows account settings button", async () => {
        // TODO: Implement test
    }, 10000);

    it("Account settings panel can be opened", async () => {
        // TODO: Implement test
    }, 10000);

    it("Logout button logs out user", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can log back in after logging out", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
