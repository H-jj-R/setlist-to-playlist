/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import * as puppeteer from "puppeteer";

import { clearInput, delay, launch, resetSettings } from "../testingUtils";

let browser: puppeteer.Browser;
let page: puppeteer.Page;

/**
 * Tests related to the About + Support page.
 */
describe("About + Support Page", () => {
    beforeAll(async () => {
        ({ browser, page } = await launch());
        await resetSettings(page);
    }, 20000);

    it("Go to About + Support page", async () => {
        const settingsBut = await page.waitForSelector("#settings-btn");
        await settingsBut.click();
        await delay(500);
        const aboutSupportLink = await page.waitForSelector("#about-support-link");
        await Promise.all([aboutSupportLink.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/about");
    }, 10000);

    it("Can type in email field", async () => {
        const inputTest = "My test input";
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, emailInput);
        expect(value).toBe(inputTest);
    }, 10000);

    it("Can type in message field", async () => {
        const inputTest = "My test message";
        const messageInput = await page.waitForSelector("#message-input");
        await messageInput.type(inputTest);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, messageInput);
        expect(value).toBe(inputTest);
    }, 10000);

    it("Email and message input fields can be cleared", async () => {
        const emailInput = await page.waitForSelector("#email-input");
        const messageInput = await page.waitForSelector("#message-input");
        await clearInput(page, emailInput);
        await clearInput(page, messageInput);
        const emailValue = await page.evaluate((input: HTMLInputElement): string => input.value, emailInput);
        const messageValue = await page.evaluate((input: HTMLInputElement): string => input.value, emailInput);
        expect(emailValue).toBe("");
        expect(messageValue).toBe("");
    }, 10000);

    it("Cannot submit with empty email and message", async () => {
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const error = await page.waitForSelector("#email-input:invalid, #message-input:invalid");
        expect(error).toBeTruthy();
    }, 10000);

    it("Cannot submit with message but empty email", async () => {
        const messageInput = await page.waitForSelector("#message-input");
        await messageInput.type("Test message");
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const error = await page.waitForSelector("#email-input:invalid");
        expect(error).toBeTruthy();
        await clearInput(page, messageInput);
    }, 10000);

    it("Cannot submit with email but empty message", async () => {
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("test@example.com");
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const error = await page.waitForSelector("#message-input:invalid");
        expect(error).toBeTruthy();
        await clearInput(page, emailInput);
    }, 10000);

    it("Cannot submit with invalid email", async () => {
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("invalid email");
        const messageInput = await page.waitForSelector("#message-input");
        await messageInput.type("Valid message");
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const error = await page.waitForSelector("#email-input:invalid");
        expect(error).toBeTruthy();
        await clearInput(page, emailInput);
        await clearInput(page, messageInput);
    }, 10000);

    it("Typing in message field correctly updates character counter", async () => {
        const messageInput = await page.waitForSelector("#message-input");
        await messageInput.type("Message counter test!");
        const counterText = await page.$eval("#message-length-counter", (el: Element): string => el.textContent);
        expect(counterText).toContain("21");
        await clearInput(page, messageInput);
    }, 10000);

    it("Cannot type over character limit (1000)", async () => {
        const messageInput = await page.waitForSelector("#message-input");
        const longText = "A".repeat(1000);
        await page.evaluate((text: string): void => {
            (document.querySelector("#message-input") as HTMLInputElement).value = text;
        }, longText);
        const value = await page.evaluate((input: HTMLInputElement): string => input.value, messageInput);
        expect(value.length).toBe(1000);
        await clearInput(page, messageInput);
    }, 10000);

    it("Valid email and message submits form", async () => {
        const emailInput = await page.waitForSelector("#email-input");
        await emailInput.type("valid@example.com");
        const messageInput = await page.waitForSelector("#message-input");
        await messageInput.type("This is a valid message.");
        const submitBtn = await page.waitForSelector("#submit-btn");
        await submitBtn.click();
        const successMessage = await page.waitForSelector("#message-sent-text");
        expect(successMessage).toBeTruthy();
    }, 10000);

    it("'Submit Another' button puts form back on page with empty fields", async () => {
        const submitAnotherBtn = await page.waitForSelector("#submit-another-btn");
        await submitAnotherBtn.click();
        const emailValue = await page.$eval("#email-input", (input: HTMLInputElement): string => input.value);
        const messageValue = await page.$eval("#message-input", (input: HTMLInputElement): string => input.value);
        expect(emailValue).toBe("");
        expect(messageValue).toBe("");
    }, 10000);

    it("Spotify link opens Spotify page", async () => {
        const [newPage] = await Promise.all([
            browser.waitForTarget((target) => target.url().includes("spotify.com")),
            page.click("#spotify-link")
        ]);
        expect(newPage.url()).toContain("spotify.com");
        (await newPage.page()).close();
    }, 10000);

    it("Setlist.fm link opens setlist.fm page", async () => {
        const [newPage] = await Promise.all([
            browser.waitForTarget((target) => target.url().includes("setlist.fm")),
            page.click("#setlist-fm-link")
        ]);
        expect(newPage.url()).toContain("setlist.fm");
        (await newPage.page()).close();
    }, 10000);

    it("Can navigate to About + Support page from Privacy Policy page", async () => {
        await page.goto("http://localhost:3000/privacy-policy");
        const aboutSupportLink = await page.waitForSelector("#privacy-contact-link");
        await Promise.all([aboutSupportLink.click(), page.waitForNavigation()]);
        expect(page.url()).toContain("/about");
    }, 10000);

    afterAll(async () => {
        await delay(500);
        await browser.close();
    }, 10000);
});
