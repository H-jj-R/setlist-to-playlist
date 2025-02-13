/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Generate Setlist section for landing page.
 */
const GenerateSetlistSection: React.FC = (): JSX.Element => {
    const router = useRouter();
    const { t: i18n } = useTranslation();

    return (
        <div
            id="generate-setlist-hero"
            className="flex min-h-[33.333333%] flex-grow flex-col items-center justify-between bg-gradient-to-r from-sky-500 to-purple-700 px-10 py-6 text-white lg:flex-row"
        >
            <div id="generate-setlist-btn-container" className="order-last lg:order-first lg:ml-auto lg:mr-auto">
                <button
                    id="go-to-ai-generate-setlist-btn"
                    className="rounded-full bg-white px-12 py-5 text-lg font-semibold text-purple-600 shadow-lg transition hover:bg-gray-100 focus:outline-none lg:mb-0"
                    onClick={(): Promise<boolean> => router.push("/ai-generate-setlist")}
                >
                    {i18n("landingPage:goToAIGenerateSetlist")}
                </button>
            </div>
            <div id="generate-setlist-text" className="text-center lg:w-1/2 lg:text-right">
                <h1 id="generate-setlist-title" className="text-4xl font-extrabold">
                    {i18n("landingPage:generateSetlistTitle")}
                </h1>
                <p id="generate-setlist-description" className="text-lg">
                    {i18n("landingPage:generateSetlistDescription")}
                </p>
            </div>
        </div>
    );
};

export default GenerateSetlistSection;
