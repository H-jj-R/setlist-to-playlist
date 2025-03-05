/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInputs, delay, launch, resetSettings } from "../testingUtils";

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
        const loginBtn = await page.waitForSelector("#login-btn");
        await loginBtn.click();
        const loginDialog = await page.waitForSelector("#login-dialog");
        expect(loginDialog).toBeDefined();
    }, 10000);

    it("'No account?' link opens Signup", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Sign Up")).toBeTruthy();
    }, 10000);

    it("'Already have an account?' link opens Login", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Login")).toBeTruthy();
    }, 10000);

    it("'No account?' link re-opens Signup", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Sign Up")).toBeTruthy();
    }, 10000);

    it("Can type in username field", async () => {
        const inputTest = "My test input";
        const userNameInput = await page.waitForSelector("#username-input");
        await userNameInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, userNameInput);
        expect(value).toBe(inputTest);
        await clearInputs(page, [userNameInput]);
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

    it("Cannot signup with empty username", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("test@example.com");
        await passwordInput.type("MyTestPassword123!");
        await submitBtn.click();
        const usernameError = await page.waitForSelector("#username-input:invalid");
        expect(usernameError).toBeDefined();
        await clearInputs(page, [emailInput, passwordInput]);
    }, 10000);

    it("Cannot signup with empty email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await usernameInput.type("testuser");
        await passwordInput.type("MyTestPassword123!");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
        await clearInputs(page, [usernameInput, passwordInput]);
    }, 10000);

    it("Cannot signup with empty password", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        await usernameInput.type("testuser");
        await emailInput.type("test@example.com");
        await submitBtn.click();
        const passwordError = await page.waitForSelector("#password-input:invalid");
        expect(passwordError).toBeDefined();
        await clearInputs(page, [usernameInput, emailInput]);
    }, 10000);

    it("Cannot signup with invalid username", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await usernameInput.type("u");
        await emailInput.type("test@example.com");
        await passwordInput.type("MyTestPassword123!");
        await submitBtn.click();
        const usernameError = await page.waitForSelector("#username-error");
        expect(usernameError).toBeDefined();
        await clearInputs(page, [usernameInput, emailInput, passwordInput]);
    }, 10000);

    it("Cannot signup with invalid email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await usernameInput.type("testuser");
        await emailInput.type("testexample.com");
        await passwordInput.type("MyTestPassword123!");
        await submitBtn.click();
        const emailError = await page.waitForSelector("#email-input:invalid");
        expect(emailError).toBeDefined();
        await clearInputs(page, [usernameInput, emailInput, passwordInput]);
    }, 10000);

    it("Cannot signup with invalid password", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await usernameInput.type("testuser");
        await emailInput.type("test@example.com");
        await passwordInput.type("password");
        await submitBtn.click();
        const passwordError = await page.waitForSelector("#password-error");
        expect(passwordError).toBeDefined();
        await clearInputs(page, [usernameInput, emailInput, passwordInput]);
    }, 10000);

    it("Can signup with valid details", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await usernameInput.type("testuser");
        await emailInput.type("testuser@example.com");
        await passwordInput.type("TestPassword123!");
        await submitBtn.click();
        await page.waitForFunction((): boolean => {
            const titleElement = document.querySelector("#message-dialog-title");
            return titleElement && !titleElement.textContent.includes("Loading");
        });
        const messageDialogTitle = await page.waitForSelector("#message-dialog-title");
        const titleText = await messageDialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Success")).toBeTruthy();
    }, 10000);

    it("Signing up successfully takes user back to login", async () => {
        const messageDialog = await page.waitForSelector("#message-dialog-box");
        const closeMessageBtn = await messageDialog.waitForSelector("#close-btn");
        await closeMessageBtn.click();
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Login")).toBeTruthy();
    }, 10000);

    it("Cannot sign up with same email again", async () => {
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        const submitBtn = await page.waitForSelector("#submit-btn");
        const usernameInput = await page.waitForSelector("#username-input");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await clearInputs(page, [usernameInput, emailInput, passwordInput]);
        await usernameInput.type("testuser");
        await emailInput.type("testuser@example.com");
        await passwordInput.type("TestPassword123!");
        await submitBtn.click();
        await page.waitForFunction((): boolean => {
            const titleElement = document.querySelector("#message-dialog-title");
            return titleElement && !titleElement.textContent.includes("Loading");
        });
        const messageDialogTitle = await page.waitForSelector("#message-dialog-title");
        const titleText = await messageDialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Error")).toBeTruthy();
    }, 10000);

    it("Can login with newly created user details", async () => {
        const messageDialog = await page.waitForSelector("#message-dialog-box");
        const closeMessageBtn = await messageDialog.waitForSelector("#close-btn");
        await closeMessageBtn.click();
        const switchLink = await page.waitForSelector("#switch-login-signup-link");
        await switchLink.click();
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await clearInputs(page, [emailInput, passwordInput]);
        await emailInput.type("testuser@example.com");
        await passwordInput.type("TestPassword123!");
        await submitBtn.click();
        const accountBtn = await page.waitForSelector("#account-btn");
        expect(accountBtn).toBeDefined();
    }, 10000);

    it("'Delete Account' button brings up 'Are You Sure' message", async () => {
        const accountBtn = await page.waitForSelector("#account-btn");
        await accountBtn.click();
        await delay(500);
        const deleteAccountBtn = await page.waitForSelector("#delete-account-btn");
        await deleteAccountBtn.click();
        const confirmationModal = await page.waitForSelector("#confirmation-modal-container");
        expect(confirmationModal).toBeDefined();
    }, 10000);

    it("'Cancel' button doesn't proceed with account deletion", async () => {
        const cancelBtn = await page.waitForSelector("#cancel-btn");
        await cancelBtn.click();
        const modalStillExists = await page.$("#confirmation-modal-container");
        expect(modalStillExists).toBeNull();
        const accountPanel = await page.waitForSelector("#account-settings-panel");
        expect(accountPanel).toBeDefined();
    }, 10000);

    it("'Yes, Delete' button proceeds with account deletion and logs out user", async () => {
        const deleteAccountBtn = await page.waitForSelector("#delete-account-btn");
        await deleteAccountBtn.click();
        const confirmBtn = await page.waitForSelector("#confirm-btn");
        await confirmBtn.click();
        const loginBtn = await page.waitForSelector("#login-btn");
        expect(loginBtn).toBeDefined();
    }, 10000);

    it("Cannot login anymore with deleted account's details", async () => {
        const loginBtn = await page.waitForSelector("#login-btn");
        await loginBtn.click();
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        const passwordInput = await page.waitForSelector("#password-input");
        await emailInput.type("testuser@example.com");
        await passwordInput.type("TestPassword123!");
        await submitBtn.click();
        await page.waitForFunction((): boolean => {
            const titleElement = document.querySelector("#message-dialog-title");
            return titleElement && !titleElement.textContent.includes("Loading");
        });
        const messageDialogTitle = await page.waitForSelector("#message-dialog-title");
        const titleText = await messageDialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Error")).toBeTruthy();
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
