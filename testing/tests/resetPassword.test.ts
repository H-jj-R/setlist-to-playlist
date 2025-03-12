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
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("noaccount@email.com");
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
        await clearInputs(page, [emailInput]);
    }, 10000);

    it("Can submit request with valid email", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("tester@setlisttoplaylist.com");
        await submitBtn.click();
        await delay(100);
        await page.waitForSelector("#message-dialog-box", { hidden: true });
        const messageDialog = await page.$("#message-dialog-box");
        expect(messageDialog).toBeNull();
    }, 10000);

    it("Submitting request opens Reset Password", async () => {
        const dialogTitle = await page.waitForSelector("#login-form-title");
        const titleText = await dialogTitle.evaluate((el): string => el.textContent);
        expect(titleText.includes("Reset Password")).toBeTruthy();
    }, 10000);

    it("Can type in new password field", async () => {
        const inputTest = "My test input";
        const passwordInput = await page.waitForSelector("#new-password-input");
        await passwordInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, passwordInput);
        expect(value).toBe(inputTest);
        await clearInputs(page, [passwordInput]);
    }, 10000);

    it("'Show' button shows new password input to user", async () => {
        const passwordInput = await page.waitForSelector("#new-password-input");
        const showButton = await page.waitForSelector("#toggle-new-password-visibility-btn");
        const initialType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(initialType).toBe("password");
        await showButton.click();
        const visibleType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(visibleType).toBe("text");
    }, 10000);

    it("'Hide' button hides new password input from user", async () => {
        const passwordInput = await page.waitForSelector("#new-password-input");
        const showButton = await page.waitForSelector("#toggle-new-password-visibility-btn");
        const initialType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(initialType).toBe("text");
        await showButton.click();
        const visibleType = await passwordInput.evaluate((input: HTMLInputElement): string => input.type);
        expect(visibleType).toBe("password");
    }, 10000);

    it("OTP input allows users to enter 6 digits", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        expect(inputs.length).toBe(6);
        for (let i = 0; i < 6; i++) {
            await inputs[i].type(`${i + 1}`);
        }
        const values = await Promise.all(
            inputs.map((input): Promise<string> => input.evaluate((el: HTMLInputElement): string => el.value))
        );
        expect(values.join("")).toBe("123456");
    }, 10000);

    it("OTP input doesn't allow non-numeric characters", async () => {
        const input = await page.$("#otp-input-0");
        await clearInputs(page, [input]);
        await input.type("a");
        const value = await input.evaluate((el: HTMLInputElement) => el.value);
        expect(value).toBe("");
    }, 10000);

    it("Moves OTP input focus to the next input when a digit is entered", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        await inputs[0].type("1");
        const activeElementId = await page.evaluate((): string => document.activeElement?.id);
        expect(activeElementId).toBe("otp-input-1");
    }, 10000);

    it("Backspace moves OTP input focus to the previous input", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        await inputs[0].type("1");
        await inputs[1].type("2");
        await inputs[1].press("Backspace");
        const activeElementId = await page.evaluate(() => document.activeElement?.id);
        expect(activeElementId).toBe("otp-input-1");
    }, 10000);

    it("ArrowLeft key moves OTP input focus to the previous input", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        await inputs[1].click();
        await inputs[1].press("ArrowLeft");
        const activeElementId = await page.evaluate(() => document.activeElement?.id);
        expect(activeElementId).toBe("otp-input-0");
    }, 10000);

    it("ArrowRight key moves OTP input focus to the next input", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        await inputs[0].click();
        await inputs[0].press("ArrowRight");
        const activeElementId = await page.evaluate(() => document.activeElement?.id);
        expect(activeElementId).toBe("otp-input-1");
    }, 10000);

    it("Cannot reset password if not all OTP input fields are filled", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await inputs[0].type("1");
        await inputs[1].type("2");
        const passwordInput = await page.waitForSelector("#new-password-input");
        await passwordInput.type("NewPassword123!");
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const otpError = await page.waitForSelector("#otp-input-2:invalid");
        expect(otpError).toBeDefined();
        await clearInputs(page, [passwordInput]);
    }, 10000);

    it("Cannot reset password with invalid new password", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        for (let i = 0; i < 6; i++) {
            await inputs[i].type(`${i + 1}`);
        }
        const submitBtn = await page.waitForSelector("#submit-btn");
        const passwordInput = await page.waitForSelector("#new-password-input");
        await passwordInput.type("password");
        await submitBtn.click();
        const passwordError = await page.waitForSelector("#password-error");
        expect(passwordError).toBeDefined();
        await clearInputs(page, [passwordInput]);
    }, 10000);

    it("Cannot reset password with incorrect OTP", async () => {
        const inputs = await page.$$("#otp-inputs-container input");
        await clearInputs(page, inputs);
        for (let i = 0; i < 6; i++) {
            await inputs[i].type("0");
        }
        const submitBtn = await page.waitForSelector("#submit-btn");
        const passwordInput = await page.waitForSelector("#new-password-input");
        await passwordInput.type("NewPassword123!");
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
        await delay(100);
        await browser.close();
    }, 10000);
});
