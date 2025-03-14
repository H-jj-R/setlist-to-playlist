/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import Layout from "@components/Shared/Layout";
import { useTranslation } from "react-i18next";

/**
 * Renders a custom 500 error page.
 * It displays a friendly error message for server-side issues.
 *
 * @returns The rendered custom 500 page.
 */
export default function Custom500() {
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <Layout>
            <div
                id="internal-error-page-container"
                className="flex h-1/3 flex-col items-center justify-center text-center"
            >
                <h1 id="internal-error-page-title" className="mb-4 text-4xl font-bold">
                    {i18n("commmon:500PageTitle")}
                </h1>
                <h2 id="internal-error-page-message" className="mb-6 text-xl">
                    {i18n("common:500PageMessage")}
                </h2>
            </div>
        </Layout>
    );
}
