import { useEffect, useState } from "react";
import Layout from "@components/Layout";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

/**
 * About page, containing details about the site, and a support/feedback form.
 */
export default function About() {
    const { t: i18n } = useTranslation();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const MAX_MESSAGE_LENGTH = 1000;

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement submission logic
        setSubmitted(true);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
                <h1 className="flex justify-center text-3xl font-bold mb-4">{i18n("about:aboutThisSite")}</h1>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:whatIsThisApp")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:whatIsThisAppDescription")}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">{i18n("about:supportAndFeedback")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{i18n("about:fillOutFormBelow")}</p>
                    {submitted ? (
                        <p className="text-green-600 dark:text-green-400 mt-4">{i18n("about:messageSent")}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300">{i18n("common:email")}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    maxLength={320}
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
                                    onChange={handleChange}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    className="w-full p-2 mt-1 border rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                                    rows={4}
                                    required
                                ></textarea>
                                <div className="pr-3 absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400">
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
                            <li>{i18n("about:spotifyAPIDisclaimer")}</li>
                            <li>{i18n("about:setlistFmAPIDisclaimer")}</li>
                            <li>{i18n("about:apiUsageDisclaimer")}</li>
                        </ul>
                    </section>
                </section>
            </div>
        </Layout>
    );
}
