/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
    locked?: boolean; // Determines if the search bar should be locked
    onSearch: (query: string) => void; // Callback function for the search action
}

/**
 * Primary search bar component.
 * This component allows users to search for artists/bands or setlist.fm links.
 */
const SearchBar: React.FC<SearchBarProps> = ({ locked, onSearch }) => {
    const { t: i18n } = useTranslation();
    const [query, setQuery] = useState("");

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
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !locked) {
                            onSearch(query);
                        }
                    }}
                    placeholder={i18n("setlistSearch:searchForSetlist")}
                    type="text"
                    value={query}
                />
                <button
                    id="search-button"
                    className={`h-12 rounded-r-lg bg-gradient-to-bl from-blue-400 to-blue-600 px-6 py-2 font-semibold text-white hover:from-blue-500 hover:to-blue-700 ${
                        locked
                            ? "cursor-not-allowed from-gray-400 to-gray-600 hover:from-gray-400 hover:to-gray-600"
                            : ""
                    }`}
                    disabled={locked}
                    onClick={() => onSearch(query)}
                >
                    {i18n("common:search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
