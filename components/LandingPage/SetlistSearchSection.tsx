/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * **SetlistSearchSection Component**
 *
 * Displays the option to go the setlist-search page.
 *
 * @returns {JSX.Element} The rendered `SetlistSearchSection` component.
 */
const SetlistSearchSection: React.FC<{}> = (): JSX.Element => {
    const router = useRouter(); // Router hook
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div
            id="setlist-search-section"
            className="flex min-h-[33.333333%] grow flex-col items-center justify-between bg-linear-to-r from-pink-600 to-orange-500 px-10 py-6 text-white lg:flex-row"
        >
            <div id="setlist-search-text" className="text-center lg:mb-0 lg:w-1/2 lg:text-left">
                <h1 id="setlist-search-title" className="text-4xl font-extrabold">
                    {i18n("landingPage:landingPageTitle")}
                </h1>
                <p id="setlist-search-description" className="text-lg">
                    {i18n("landingPage:landingPageDescription")}
                </p>
            </div>
            <div id="setlist-search-btn-container" className="lg:mx-auto">
                <button
                    id="go-to-setlist-search-btn"
                    className="rounded-full bg-white px-12 py-5 text-lg font-semibold text-pink-600 shadow-lg transition hover:cursor-pointer hover:bg-gray-200 focus:outline-hidden"
                    onClick={(): Promise<boolean> => router.push("/setlist-search")}
                >
                    {i18n("landingPage:goToSetlistSearch")}
                </button>
            </div>
        </div>
    );
};

export default SetlistSearchSection;
