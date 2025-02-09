/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Hero section for landing page.
 */
const HeroSection: React.FC = () => {
    const router = useRouter();
    const { t: i18n } = useTranslation();

    return (
        <div
            id="landing-page-hero"
            className="flex min-h-[33.333333%] flex-grow flex-col items-center justify-between bg-gradient-to-r from-pink-600 to-orange-500 px-10 py-6 text-white lg:flex-row"
        >
            <div id="landing-page-text" className="mb-6 text-center lg:mb-0 lg:w-1/2 lg:text-left">
                <h1 id="landing-page-title" className="mb-4 text-4xl font-extrabold">
                    {i18n("landingPage:landingPageTitle")}
                </h1>
                <p id="landing-page-description" className="mb-8 text-lg">
                    {i18n("landingPage:landingPageDescription")}
                </p>
            </div>
            <div id="setlist-search-button-container" className="lg:ml-auto lg:mr-auto">
                <button
                    id="go-to-setlist-search-button"
                    onClick={() => router.push("/setlist-search")}
                    className="mb-10 rounded-full bg-white px-12 py-5 text-lg font-semibold text-pink-600 shadow-lg transition hover:bg-gray-100 focus:outline-none"
                >
                    {i18n("landingPage:goToSetlistSearch")}
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
