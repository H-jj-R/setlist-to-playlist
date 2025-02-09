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
 */
export default function PrivacyPolicy(): JSX.Element {
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

    return (
        <Layout>
            <div id="" className="mx-auto max-w-2xl p-6">
                <h1 id="" className="mb-4 text-3xl font-bold">
                    {i18n("privacyPolicy:privacyPolicy")}
                </h1>
                <section id="" className="mb-6">
                    <h2 id="" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:introduction")}
                    </h2>
                    <p id="" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:introductionContent")}
                    </p>
                </section>
                <section id="" className="mb-6">
                    <h2 id="" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:dataWeCollect")}
                    </h2>
                    <ul id="" className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                        <li id="">
                            <strong>{i18n("privacyPolicy:accountInformation")}</strong>{" "}
                            {i18n("privacyPolicy:accountInformationContent")}
                        </li>
                        <li id="">
                            <strong>{i18n("privacyPolicy:spotifyData")}</strong>{" "}
                            {i18n("privacyPolicy:spotifyDataContent")}
                        </li>
                        <li id="">
                            <strong>{i18n("privacyPolicy:setlistData")}</strong>{" "}
                            {i18n("privacyPolicy:setlistDataContent")}
                        </li>
                    </ul>
                </section>
                <section id="" className="mb-6">
                    <h2 id="" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:howWeUseData")}
                    </h2>
                    <p id="" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:howWeUseDataContent")}
                    </p>
                </section>
                <section id="" className="mb-6">
                    <h2 id="" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:yourRights")}
                    </h2>
                    <p id="" className="text-gray-700 dark:text-gray-300">
                        {i18n("privacyPolicy:yourRightsContent")}
                    </p>
                </section>
                <section id="" className="mb-6">
                    <h2 id="" className="mb-2 text-xl font-semibold">
                        {i18n("privacyPolicy:contactUs")}
                    </h2>
                    <p id="" className="text-gray-700 dark:text-gray-300">
                        <Trans
                            id=""
                            components={{
                                aboutLink: (
                                    <Link
                                        id=""
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
