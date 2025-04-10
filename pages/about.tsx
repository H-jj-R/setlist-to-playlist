/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialog from "@components/Dialogs/MessageDialog";
import Layout from "@components/Shared/Layout";
import MessageDialogState from "@constants/messageDialogState";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

/**
 * About page, containing details about the site, and a support/feedback form.
 *
 * @returns The rendered `/about` page.
 */
export default function About() {
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const { t: i18n } = useTranslation(); // Translation hook
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted
    const [state, setState] = useState({
        formData: { email: "", message: "" }, // Tracks the support/feedback form data
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }, // Tracks the message dialog state
        submitted: false // Tracks if the form has been submitted
    });

    /**
     * Maximum length the feedback message can be.
     */
    const MAX_MESSAGE_LENGTH: number = 1000;

    /**
     * Sets the component as mounted when first rendered.
     */
    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    /**
     * Handles the form submission for the support/feedback form.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", type: MessageDialogState.Loading }
        }));
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const email = formData.get("email") as string;
            const message = formData.get("message") as string;

            // Submit the feedback message to the backend
            const response = await fetch("/api/controllers/submit-feedback", {
                body: JSON.stringify({ email, message }),
                headers: { "Content-Type": "application/json" },
                method: "POST"
            });
            if (!response.ok) {
                const data = await response.json();
                throw {
                    error: i18n(data.error),
                    status: response.status
                };
            } else {
                setState((prev) => ({
                    ...prev,
                    messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success },
                    submitted: true
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: error.error || i18n("common:unknownError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <Layout>
            <div id="about-container" className="mx-auto max-w-4xl p-6">
                <h1 id="about-title" className="mb-4 flex justify-center text-3xl font-bold">
                    {i18n("about:aboutThisSite")}
                </h1>
                <section id="about-intro" className="mb-6">
                    <h2 id="what-is-app" className="text-xl font-semibold">
                        {i18n("about:whatIsThisApp")}
                    </h2>
                    <p id="what-is-app-description" className="mt-2 text-gray-700 dark:text-gray-300">
                        {i18n("about:whatIsThisAppDescription")}
                    </p>
                </section>
                <section id="about-support" className="mb-6">
                    <h2 id="support-feedback" className="text-xl font-semibold">
                        {i18n("about:supportAndFeedback")}
                    </h2>
                    <p id="support-feedback-description" className="mt-2 text-gray-700 dark:text-gray-300">
                        {i18n("about:fillOutFormBelow")}
                    </p>
                    {state.submitted ? (
                        <div id="message-sent-container" className="mt-4 flex items-center gap-2">
                            <p id="message-sent-text" className="text-lg font-bold text-green-600 dark:text-green-400">
                                {i18n("about:messageSent")}
                            </p>
                            <button
                                id="submit-another-btn"
                                className="text-md mx-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                onClick={(): void => {
                                    setState((prev) => ({
                                        ...prev,
                                        formData: { email: "", message: "" },
                                        submitted: false
                                    }));
                                }}
                                role="button"
                            >
                                {i18n("about:submitAnother")}
                            </button>
                        </div>
                    ) : (
                        <form id="support-feedback-form" className="mt-4" onSubmit={handleSubmit}>
                            <div id="email-field" className="mb-4">
                                <label
                                    id="email-label"
                                    className="block text-gray-700 dark:text-gray-300"
                                    htmlFor="email-input"
                                >
                                    {i18n("common:email")}
                                    <input
                                        id="email-input"
                                        className="mt-1 w-full rounded-sm border border-gray-900 bg-gray-100 p-2 dark:border-gray-300 dark:bg-gray-800 dark:text-white"
                                        aria-label={i18n("common:email")}
                                        autoComplete="email"
                                        maxLength={320}
                                        name="email"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            setState((prev) => ({
                                                ...prev,
                                                formData: { ...state.formData, [e.target.name]: e.target.value }
                                            }));
                                        }}
                                        placeholder={i18n("common:email")}
                                        required
                                        type="email"
                                        value={state.formData.email}
                                    />
                                </label>
                            </div>
                            <div id="message-field" className="relative mb-4">
                                <label
                                    id="message-label"
                                    className="block text-gray-700 dark:text-gray-300"
                                    htmlFor="message-input"
                                >
                                    {i18n("about:message")}
                                    <textarea
                                        id="message-input"
                                        className="mt-1 w-full resize-none overflow-hidden rounded-sm border border-gray-900 bg-gray-100 p-2 dark:border-gray-300 dark:bg-gray-800 dark:text-white"
                                        aria-label={i18n("about:message")}
                                        maxLength={MAX_MESSAGE_LENGTH}
                                        name="message"
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                                            setState((prev) => ({
                                                ...prev,
                                                formData: { ...state.formData, [e.target.name]: e.target.value }
                                            }));
                                        }}
                                        onInput={(e: React.FormEvent<HTMLTextAreaElement>): void => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                        required
                                        rows={4}
                                        value={state.formData.message}
                                    />
                                </label>
                                <div
                                    id="message-length-counter"
                                    className="absolute right-2 bottom-2 text-sm text-gray-500 dark:text-gray-400"
                                >
                                    {state.formData.message.length}/{MAX_MESSAGE_LENGTH}
                                </div>
                            </div>
                            <div id="submit-btn-container" className="flex">
                                <button
                                    id="submit-btn"
                                    className="rounded-md bg-blue-600 px-8 py-3 text-white transition hover:cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    role="button"
                                    type="submit"
                                >
                                    {i18n("common:submit")}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
                <section id="about-credits" className="mb-6">
                    <h2 id="credits-title" className="text-xl font-semibold">
                        {i18n("about:credits")}
                    </h2>
                    <p id="credits-description" className="mt-2 text-gray-700 dark:text-gray-300">
                        {i18n("about:developedWith")}
                    </p>
                    <section id="api-usage" className="mb-6">
                        <p id="api-description" className="mt-2 text-gray-700 dark:text-gray-300">
                            {i18n("about:usesAPIs")}
                        </p>
                        <ul id="api-list" className="mt-2 list-inside list-disc text-gray-700 dark:text-gray-300">
                            <li id="spotify-api">
                                <Trans
                                    id="spotify-api-text"
                                    components={{
                                        spotifyLink: (
                                            <Link
                                                id="spotify-link"
                                                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                                href="https://spotify.com/"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            />
                                        )
                                    }}
                                    i18nKey="about:spotifyAPIDisclaimer"
                                />
                            </li>
                            <li id="setlist-fm-api">
                                <Trans
                                    id="setlist-fm-api-text"
                                    components={{
                                        setlistFmLink: (
                                            <Link
                                                id="setlist-fm-link"
                                                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                                href="https://www.setlist.fm/"
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            />
                                        )
                                    }}
                                    i18nKey="about:setlistFmAPIDisclaimer"
                                />
                            </li>
                            <li id="api-disclaimer">{i18n("about:apiUsageDisclaimer")}</li>
                        </ul>
                    </section>
                </section>
            </div>
            {state.messageDialog.isOpen && (
                <MessageDialog
                    message={state.messageDialog.message}
                    onClose={(): void =>
                        setState((prev) => ({
                            ...prev,
                            messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
                        }))
                    }
                    type={state.messageDialog.type}
                />
            )}
        </Layout>
    );
}
