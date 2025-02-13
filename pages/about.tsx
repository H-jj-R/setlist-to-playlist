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
 */
export default function About(): JSX.Element {
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        formData: { email: "", message: "" },
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success },
        submitted: false
    });

    const MAX_MESSAGE_LENGTH: number = 1000;

    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

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
                                className="text-md mx-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                onClick={(): void => {
                                    setState((prev) => ({
                                        ...prev,
                                        formData: { email: "", message: "" },
                                        submitted: false
                                    }));
                                }}
                            >
                                {i18n("about:submitAnother")}
                            </button>
                        </div>
                    ) : (
                        <form id="support-feedback-form" className="mt-4" onSubmit={handleSubmit}>
                            <div id="email-field" className="mb-4">
                                <label id="email-label" className="block text-gray-700 dark:text-gray-300">
                                    {i18n("common:email")}
                                    <input
                                        id="email-input"
                                        className="mt-1 w-full rounded border bg-gray-100 p-2 dark:bg-gray-800 dark:text-white"
                                        autoComplete="email"
                                        maxLength={320}
                                        name="email"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                            setState((prev) => ({
                                                ...prev,
                                                formData: { ...state.formData, [e.target.name]: e.target.value }
                                            }));
                                        }}
                                        required
                                        type="email"
                                        value={state.formData.email}
                                    />
                                </label>
                            </div>
                            <div id="message-field" className="relative mb-4">
                                <label id="message-label" className="block text-gray-700 dark:text-gray-300">
                                    {i18n("about:message")}
                                    <textarea
                                        id="message-input"
                                        className="mt-1 w-full resize-none overflow-hidden rounded border bg-gray-100 p-2 dark:bg-gray-800 dark:text-white"
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
                                    className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400"
                                >
                                    {state.formData.message.length}/{MAX_MESSAGE_LENGTH}
                                </div>
                            </div>
                            <div id="submit-btn-container" className="flex">
                                <button
                                    id="submit-btn"
                                    className="rounded-md bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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

            {/* Message Dialog */}
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
