/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import Layout from "@components/Shared/Layout";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

/**
 * Privacy Policy page.
 *
 * @returns {JSX.Element} The rendered `/privacy-policy` page.
 */
export default function PrivacyPolicy(): JSX.Element {
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const { t: i18n } = useTranslation(); // Translation hook
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted

    /**
     * Sets the component as mounted when first rendered.
     */
    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <Layout>
            <div id="privacy-policy" className="mx-auto max-w-2xl p-6">
                <h1 id="privacy-policy-title" className="mb-4 text-3xl font-bold">
                    {i18n("privacyPolicy:privacyPolicy")}
                </h1>
                <section id="privacy-introduction" className="mb-6">
                    <h2 id="privacy-introduction-title" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:introduction")}
                    </h2>
                    <p id="privacy-introduction-content" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:introductionContent")}
                    </p>
                </section>
                <section id="privacy-data-collection" className="mb-6">
                    <h2 id="privacy-data-collection-title" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:dataWeCollect")}
                    </h2>
                    <ul id="privacy-data-list" className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li id="privacy-account-info">
                            <strong>{i18n("privacyPolicy:accountInformation")}</strong>{" "}
                            {i18n("privacyPolicy:accountInformationContent")}
                        </li>
                        <li id="privacy-spotify-data">
                            <strong>{i18n("privacyPolicy:spotifyData")}</strong>{" "}
                            {i18n("privacyPolicy:spotifyDataContent")}
                        </li>
                        <li id="privacy-setlist-data">
                            <strong>{i18n("privacyPolicy:setlistData")}</strong>{" "}
                            {i18n("privacyPolicy:setlistDataContent")}
                        </li>
                    </ul>
                </section>
                <section id="privacy-data-usage" className="mb-6">
                    <h2 id="privacy-data-usage-title" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:howWeUseData")}
                    </h2>
                    <p id="privacy-data-usage-content" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:howWeUseDataContent")}
                    </p>
                </section>
                <section id="privacy-rights" className="mb-6">
                    <h2 id="privacy-rights-title" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:yourRights")}
                    </h2>
                    <p id="privacy-rights-content" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:yourRightsContent")}
                    </p>
                </section>
                <section id="privacy-contact" className="mb-6">
                    <h2 id="privacy-contact-title" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:contactUs")}
                    </h2>
                    <p id="privacy-contact-content" className="text-gray-700 dark:text-gray-300">
                        <Trans
                            id="privacy-contact-trans"
                            components={{
                                aboutLink: (
                                    <Link
                                        id="privacy-contact-link"
                                        className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                                        href="/about"
                                    />
                                )
                            }}
                            i18nKey="privacyPolicy:contactUsContent"
                        />
                    </p>
                </section>
            </div>
        </Layout>
    );
}
