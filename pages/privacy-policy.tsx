/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useEffect, useState } from "react";
import Layout from "@components/Shared/Layout";
import { useTheme } from "next-themes";
import { useTranslation, Trans } from "react-i18next";
import Link from "next/link";

/**
 * Privacy Policy page.
 */
export default function PrivacyPolicy() {
    const { t: i18n } = useTranslation();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

    return (
        <Layout>
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">{i18n("privacyPolicy:privacyPolicy")}</h1>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{i18n("privacyPolicy:introduction")}</h2>
                    <p className="text-gray-700 dark:text-gray-300">{i18n("privacyPolicy:introductionContent")}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{i18n("privacyPolicy:dataWeCollect")}</h2>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li>
                            <strong>{i18n("privacyPolicy:accountInformation")}</strong>{" "}
                            {i18n("privacyPolicy:accountInformationContent")}
                        </li>
                        <li>
                            <strong>{i18n("privacyPolicy:spotifyData")}</strong>{" "}
                            {i18n("privacyPolicy:spotifyDataContent")}
                        </li>
                        <li>
                            <strong>{i18n("privacyPolicy:setlistData")}</strong>{" "}
                            {i18n("privacyPolicy:setlistDataContent")}
                        </li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{i18n("privacyPolicy:howWeUseData")}</h2>
                    <p className="text-gray-700 dark:text-gray-300">{i18n("privacyPolicy:howWeUseDataContent")}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{i18n("privacyPolicy:yourRights")}</h2>
                    <p className="text-gray-700 dark:text-gray-300">{i18n("privacyPolicy:yourRightsContent")}</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{i18n("privacyPolicy:contactUs")}</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        <Trans
                            i18nKey="privacyPolicy:contactUsContent"
                            components={{
                                aboutLink: (
                                    <Link
                                        href="/about"
                                        className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                                    />
                                )
                            }}
                        />
                    </p>
                </section>
            </div>
        </Layout>
    );
}
