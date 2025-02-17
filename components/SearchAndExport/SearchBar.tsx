/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props for the `SearchBar` component.
 *
 * @property {boolean} [isPredicted] - Optional flag indicating whether this is an AI prediction query.
 * @property {boolean} [locked] - Determines if the search bar should be locked and disabled.
 * @property {Function} onSearch - Callback function triggered when a search is performed.
 */
interface SearchBarProps {
    isPredicted?: boolean;
    locked?: boolean;
    onSearch: (query: string) => void;
}

/**
 * **SearchBar Component**
 *
 * Provides a search input field where users can type a query.
 *
 * @param SearchBarProps - The component props.
 * @returns {JSX.Element} The rendered `SearchBar` component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ isPredicted, locked, onSearch }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook
    const [query, setQuery] = useState(""); // State to track the user's search input

    return (
        <div id="search-container" className="mt-4 flex w-full items-center justify-center px-2 sm:px-4">
            <div id="search-input-wrapper" className="flex w-full max-w-xl sm:w-[70vw]">
                <input
                    id="search-input"
                    className={`h-12 flex-1 rounded-l-lg border border-gray-300 px-4 py-2 text-lg ${
                        locked ? "cursor-not-allowed bg-gray-200" : ""
                    }`}
                    autoComplete="off"
                    disabled={locked}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setQuery(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                        if (e.key === "Enter" && !locked) {
                            onSearch(query);
                        }
                    }}
                    placeholder={`${
                        !isPredicted ? i18n("setlistSearch:searchForSetlist") : i18n("generateSetlist:searchForArtist")
                    }...`}
                    type="text"
                    value={query}
                />
                <button
                    id="search-btn"
                    className={`h-12 rounded-r-lg bg-gradient-to-bl from-blue-400 to-blue-600 px-6 py-2 font-semibold text-white hover:from-blue-500 hover:to-blue-700 ${
                        locked
                            ? "cursor-not-allowed from-gray-400 to-gray-600 hover:from-gray-400 hover:to-gray-600"
                            : ""
                    }`}
                    disabled={locked}
                    onClick={(): void => onSearch(query)}
                >
                    {i18n("common:search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
