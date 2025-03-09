/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInputs, delay, launch } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to user authentication.
 */
describe("Forgot Password", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Can open Login / Sign Up dialog", async () => {
        const loginBtn = await page.waitForSelector("#login-btn");
        await loginBtn.click();
        const loginDialog = await page.waitForSelector("#login-dialog");
        expect(loginDialog).toBeDefined();
    }, 10000);

    it("Can open Forgot Password through 'Forgot Password' link", async () => {
        const forgotPasswordLink = await page.waitForSelector("#forgot-password-link");
        await forgotPasswordLink.click();
        await delay(200);
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Forgot Password")).toBeTruthy();
    }, 10000);

    it("Can type in email field", async () => {
        const inputTest = "My test input";
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, emailInput);
        expect(value).toBe(inputTest);
        await clearInputs(page, [emailInput]);
    }, 10000);

    it("Cannot submit request with blank email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
    }, 10000);

    it("Cannot submit request with invalid email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("setlisttoplaylist.com");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
        await clearInputs(page, [emailInput]);
    }, 10000);

    it("Cannot submit request with email that's not linked to an account", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can submit request with valid email", async () => {
        // TODO: Implement test
    }, 10000);

    it("Submitting request opens Reset Password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Submitting request opens Reset Password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can type in new password field", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Show' button shows new password input to user", async () => {
        // TODO: Implement test
    }, 10000);

    it("'Hide' button hides new password input from user", async () => {
        // TODO: Implement test
    }, 10000);

    it("OTP input allows users to enter a 6-digit OTP", async () => {
        // TODO: Implement test
    }, 10000);

    it("OTP input doesn't allow non-numeric characters", async () => {
        // TODO: Implement test
    }, 10000);

    it("Moves OTP input focus to the next input when a digit is entered", async () => {
        // TODO: Implement test
    }, 10000);

    it("Backspace moves OTP input focus to the previous input", async () => {
        // TODO: Implement test
    }, 10000);

    it("ArrowLeft key moves OTP input focus to the previous input", async () => {
        // TODO: Implement test
    }, 10000);

    it("ArrowRight key moves OTP input focus to the next input", async () => {
        // TODO: Implement test
    }, 10000);

    it("Allows pasting an OTP into the first input", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot reset password if not all OTP input fields are filled", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot reset password with incorrect OTP", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot reset password with invalid new password", async () => {
        // TODO: Implement test
    }, 10000);

    it("Cannot reset password with incorrect OTP", async () => {
        // TODO: Implement test
    }, 10000);

    it("Can reset password with correct OTP and valid new password", async () => {
        // TODO: Implement test
    }, 10000);

    it("User can use new password to login", async () => {
        // TODO: Implement test
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
