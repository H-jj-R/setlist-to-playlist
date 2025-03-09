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
 * Tests related to user logging in and logging out.
 */
describe("Login", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
    }, 20000);

    it("Can open Login / Sign Up dialog", async () => {
        const loginBtn = await page.waitForSelector("#login-btn");
        await loginBtn.click();
        const loginDialog = await page.waitForSelector("#login-dialog");
        expect(loginDialog).toBeDefined();
    }, 10000);

    it("'Forgot Password' link opens Forgot Password", async () => {
        const forgotPasswordLink = await page.waitForSelector("#forgot-password-link");
        await forgotPasswordLink.click();
        await delay(200);
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Forgot Password")).toBeTruthy();
    }, 10000);

    it("Can go back to Login using 'Back to Login' link", async () => {
        const backToLoginLink = await page.waitForSelector("#back-to-login-link");
        await backToLoginLink.click();
        await delay(200);
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Login")).toBeTruthy();
    }, 10000);

    it("'No account?' link opens Signup", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        await delay(200);
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Sign Up")).toBeTruthy();
    }, 10000);

    it("Can go back to Login using 'Already have an account?' link", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        await delay(200);
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Login")).toBeTruthy();
    }, 10000);

    it("Can type in email field", async () => {
        const inputTest = "My test input";
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, emailInput);
        expect(value).toBe(inputTest);
        await clearInputs(page, [emailInput]);
    }, 10000);

    it("Can type in password field", async () => {
        const inputTest = "My test input";
        const passwordInput = await page.waitForSelector("#password-input");
        await passwordInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, passwordInput);
        expect(value).toBe(inputTest);
        await clearInputs(page, [passwordInput]);
    }, 10000);

    it("'Show' button shows password input to user", async () => {
        const passwordInput = await page.waitForSelector("#password-input");
        const showButton = await page.waitForSelector("#toggle-password-visibility-btn");
        const initialType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(initialType).toBe("password");
        await showButton.click();
        const visibleType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(visibleType).toBe("text");
    }, 10000);

    it("'Hide' button hides password input from user", async () => {
        const passwordInput = await page.waitForSelector("#password-input");
        const showButton = await page.waitForSelector("#toggle-password-visibility-btn");
        const initialType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(initialType).toBe("text");
        await showButton.click();
        const visibleType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(visibleType).toBe("password");
    }, 10000);

    it("Cannot login with blank inputs", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const error = await page.waitForSelector("#email-input:invalid, #password-input:invalid");
        expect(error).toBeTruthy();
    }, 10000);

    it("Cannot login with blank email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const passwordInput = await page.waitForSelector("#password-input");
        await passwordInput.type("TesterPassword123!");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
        await clearInputs(page, [passwordInput]);
    }, 10000);

    it("Cannot login with blank password", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("tester@setlisttoplaylist.com");
        await submitBtn.click();
        const passwordError = await page.waitForSelector("#password-input:invalid");
        expect(passwordError).toBeDefined();
        await clearInputs(page, [emailInput]);
    }, 10000);

    it("Cannot login with invalid email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("setlisttoplaylist.com");
        await passwordInput.type("TesterPassword123!");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
        await clearInputs(page, [emailInput, passwordInput]);
    }, 10000);

    it("Cannot login with incorrect password", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("tester@setlisttoplaylist.com");
        await passwordInput.type("WrongPassword123!");
        await submitBtn.click();
        await page.waitForFunction((): boolean => {
            const titleElement = document.querySelector("#message-dialog-title");
            return titleElement && !titleElement.textContent.includes("Loading");
        });
        const messageDialogTitle = await page.waitForSelector("#message-dialog-title");
        const titleText = await messageDialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Error")).toBeTruthy();
        const messageDialog = await page.waitForSelector("#message-dialog-box");
        const closeMessageBtn = await messageDialog.waitForSelector("#close-btn");
        await closeMessageBtn.click();
        await delay(200);
        await clearInputs(page, [emailInput, passwordInput]);
    }, 10000);

    it("Can login with valid details", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("tester@setlisttoplaylist.com");
        await passwordInput.type("TesterPassword123!");
        await submitBtn.click();
        const accountBtn = await page.waitForSelector("#account-btn");
        expect(accountBtn).toBeDefined();
    }, 10000);

    it("Account settings panel can be opened", async () => {
        const accountBtn = await page.waitForSelector("#account-btn");
        await accountBtn.click();
        await delay(400);
        const accountSettingsPanel = await page.waitForSelector("#account-settings-panel");
        expect(accountSettingsPanel).toBeDefined();
    }, 10000);

    it("Logout button closes account settings panel and logs out user", async () => {
        const logoutBtn = await page.waitForSelector("#logout-btn");
        await logoutBtn.click();
        await delay(400);
        const accountSettingsPanel = await page.$("#account-settings-panel");
        expect(accountSettingsPanel).toBeNull();
        const loginBtn = await page.waitForSelector("#login-btn");
        expect(loginBtn).toBeDefined();
    }, 10000);

    it("Login dialog can still be opened after logging out", async () => {
        const loginBtn = await page.waitForSelector("#login-btn");
        await loginBtn.click();
        const loginDialog = await page.waitForSelector("#login-dialog");
        expect(loginDialog).toBeDefined();
    }, 10000);

    it("Can log back in after logging out", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("tester@setlisttoplaylist.com");
        await passwordInput.type("TesterPassword123!");
        await submitBtn.click();
        const accountBtn = await page.waitForSelector("#account-btn");
        expect(accountBtn).toBeDefined();
    }, 10000);

    afterAll(async () => {
        await delay(100);
        await browser.close();
    }, 10000);
});
