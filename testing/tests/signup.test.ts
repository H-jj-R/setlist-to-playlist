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
 * Tests related to user signup and account deletion.
 */
describe("Signup", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Can open 'Login / Sign Up' dialog", async () => {
        // TODO: Implement test
    }, 10000);

    it("'No account?' link opens Signup", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Already have an account?' link opens Login", async () => {
        // TODO: Implement test
    }, 10000);

    it("'No account?' link re-opens Signup", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in username field", async () => {
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

    it("Can go back to Login using 'Back to Login' link", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with empty username", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with empty email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with empty password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with invalid username", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with invalid email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot signup with invalid password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can signup with valid details", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can login with newly created user details", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Delete Account' button brings up 'Are You Sure' message", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Cancel' button doesn't proceed with account deletion", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Yes, Delete' button proceeds with account deletion", async () => {
        // TODO: Implement test
    }, 10000);

    it("User is logged out after deleting account", async () => {
        // TODO: Implement test
    }, 10000);

    it("User is logged out after deleting account", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot login anymore with deleted account's details", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
