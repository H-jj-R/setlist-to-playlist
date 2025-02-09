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
export default function About() {
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({ email: "", message: "", name: "" });
    const [submitted, setSubmitted] = useState(false);
    const [messageDialog, setMessageDialog] = useState({
        isOpen: false,
        message: "",
        type: MessageDialogState.Success
    });

    const MAX_MESSAGE_LENGTH = 1000;

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessageDialog({
            isOpen: true,
            message: "",
            type: MessageDialogState.Loading
        });
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
                setMessageDialog({
                    isOpen: false,
                    message: "",
                    type: MessageDialogState.Success
                });
                setSubmitted(true);
            }
        } catch (error) {
            setMessageDialog({
                isOpen: true,
                message: error.error,
                type: MessageDialogState.Error
            });
        }
    };

    return (
        <Layout>
            <div className="mx-auto max-w-4xl p-6">
                <h1 className="mb-4 flex justify-center text-3xl font-bold">{i18n("about:aboutThisSite")}</h1>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:whatIsThisApp")}</h2>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{i18n("about:whatIsThisAppDescription")}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:supportAndFeedback")}</h2>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{i18n("about:fillOutFormBelow")}</p>
                    {submitted ? (
                        <div className="mt-4 flex items-center gap-2">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {i18n("about:messageSent")}
                            </p>
                            <button
                                className="text-md mx-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ email: "", message: "", name: "" });
                                }}
                            >
                                {i18n("about:submitAnother")}
                            </button>
                        </div>
                    ) : (
                        <form className="mt-4" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">{i18n("common:email")}</label>
                                <input
                                    className="mt-1 w-full rounded border bg-gray-100 p-2 dark:bg-gray-800 dark:text-white"
                                    autoComplete="email"
                                    maxLength={320}
                                    name="email"
                                    onChange={(e) => {
                                        setFormData({ ...formData, [e.target.name]: e.target.value });
                                    }}
                                    required
                                    type="email"
                                    value={formData.email}
                                />
                            </div>
                            <div className="relative mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">
                                    {i18n("about:message")}
                                </label>
                                <textarea
                                    className="mt-1 w-full resize-none overflow-hidden rounded border bg-gray-100 p-2 dark:bg-gray-800 dark:text-white"
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    name="message"
                                    onChange={(e) => {
                                        setFormData({ ...formData, [e.target.name]: e.target.value });
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = `${target.scrollHeight}px`;
                                    }}
                                    required
                                    rows={4}
                                    value={formData.message}
                                />
                                <div className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
                                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                                </div>
                            </div>
                            <div className="flex">
                                <button
                                    className="rounded-md bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    type="submit"
                                >
                                    {i18n("common:submit")}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:credits")}</h2>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{i18n("about:developedWith")}</p>
                    <section className="mb-6">
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{i18n("about:usesAPIs")}</p>
                        <ul className="mt-2 list-inside list-disc text-gray-700 dark:text-gray-300">
                            <li>
                                <Trans
                                    components={{
                                        spotifyLink: (
                                            <Link
                                                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                                href="https://spotify.com/"
                                            />
                                        )
                                    }}
                                    i18nKey="about:spotifyAPIDisclaimer"
                                />
                            </li>
                            <li>
                                <Trans
                                    components={{
                                        setlistFmLink: (
                                            <Link
                                                className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                                href="https://www.setlist.fm/"
                                            />
                                        )
                                    }}
                                    i18nKey="about:setlistFmAPIDisclaimer"
                                />
                            </li>
                            <li>{i18n("about:apiUsageDisclaimer")}</li>
                        </ul>
                    </section>
                </section>
            </div>
            {/* Message Dialog */}
            {messageDialog.isOpen && (
                <MessageDialog
                    message={messageDialog.message}
                    onClose={() => setMessageDialog({ isOpen: false, message: "", type: MessageDialogState.Success })}
                    type={messageDialog.type}
                />
            )}
        </Layout>
    );
}
