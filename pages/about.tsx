import { useEffect, useState } from "react";
import Layout from "@components/Shared/Layout";
import { useTheme } from "next-themes";
import { useTranslation, Trans } from "react-i18next";
import MessageDialog from "@components/Dialogs/MessageDialog";
import { MessageDialogState } from "@constants/messageDialogState";
import Link from "next/link";

/**
 * About page, containing details about the site, and a support/feedback form.
 */
export default function About() {
    const { t: i18n } = useTranslation();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message })
            });
            if (!response.ok) {
                const data = await response.json();
                throw {
                    status: response.status,
                    error: i18n(data.error)
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
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="flex justify-center text-3xl font-bold mb-4">{i18n("about:aboutThisSite")}</h1>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:whatIsThisApp")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:whatIsThisAppDescription")}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:supportAndFeedback")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:fillOutFormBelow")}</p>
                    {submitted ? (
                        <div className="flex items-center gap-2 mt-4">
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {i18n("about:messageSent")}
                            </p>
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({ name: "", email: "", message: "" });
                                }}
                                className="mx-4 px-6 py-3 text-md font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                {i18n("about:submitAnother")}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">{i18n("common:email")}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, [e.target.name]: e.target.value });
                                    }}
                                    maxLength={320}
                                    autoComplete="email"
                                    className="w-full p-2 mt-1 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label className="block text-gray-700 dark:text-gray-300">
                                    {i18n("about:message")}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={(e) => {
                                        setFormData({ ...formData, [e.target.name]: e.target.value });
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = `${target.scrollHeight}px`;
                                    }}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    className="w-full p-2 mt-1 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white resize-none overflow-hidden"
                                    rows={4}
                                    required
                                ></textarea>
                                <div className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
                                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                                </div>
                            </div>
                            <div className="flex">
                                <button
                                    type="submit"
                                    className=" text-white px-8 py-3 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {i18n("common:submit")}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:credits")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:developedWith")}</p>
                    <section className="mb-6">
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:usesAPIs")}</p>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
                            <li>
                                <Trans
                                    i18nKey="about:spotifyAPIDisclaimer"
                                    components={{
                                        spotifyLink: (
                                            <Link
                                                href="https://spotify.com/"
                                                className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                                            />
                                        )
                                    }}
                                />
                            </li>
                            <li>
                                <Trans
                                    i18nKey="about:setlistFmAPIDisclaimer"
                                    components={{
                                        setlistFmLink: (
                                            <Link
                                                href="https://www.setlist.fm/"
                                                className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                                            />
                                        )
                                    }}
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
                    type={messageDialog.type}
                    onClose={() => setMessageDialog({ isOpen: false, message: "", type: MessageDialogState.Success })}
                />
            )}
        </Layout>
    );
}
