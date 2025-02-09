/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import Layout from "@components/Shared/Layout";
import { useTranslation } from "react-i18next";

/**
 * Renders a custom 404 error page.
 * It displays a friendly error message when a page is not found.
 */
export default function Custom404() {
    const { t: i18n } = useTranslation();
    return (
        <Layout>
            <div className="flex h-1/3 flex-col items-center justify-center text-center">
                <h1 className="mb-4 text-4xl font-bold">{i18n("common:404PageTitle")}</h1>
                <h2 className="mb-6 text-xl">{i18n("common:404PageMessage")}</h2>
            </div>
        </Layout>
    );
}
