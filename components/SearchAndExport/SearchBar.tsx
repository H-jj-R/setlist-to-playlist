/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
    onSearch: (query: string) => void; // Callback function for the search action
    locked?: boolean; // Determines if the search bar should be locked
}

/**
 * Primary search bar component.
 * This component allows users to search for artists/bands or setlist.fm links.
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, locked }) => {
    const { t: i18n } = useTranslation();
    const [query, setQuery] = useState("");

    return (
        <div id="search-container" className="flex items-center justify-center w-full mt-4 px-2 sm:px-4">
            <div id="search-input-wrapper" className="flex w-full sm:w-[70vw] max-w-xl">
                <input
                    id="search-input"
                    type="text"
                    className={`flex-1 h-12 py-2 px-4 rounded-l-lg text-lg border border-gray-300 ${
                        locked ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    placeholder={i18n("setlistSearch:searchForSetlist")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !locked) {
                            onSearch(query);
                        }
                    }}
                    disabled={locked}
                    autoComplete="off"
                />
                <button
                    id="search-button"
                    onClick={() => onSearch(query)}
                    className={`h-12 py-2 px-6 text-white font-semibold rounded-r-lg bg-gradient-to-bl from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 ${
                        locked
                            ? "cursor-not-allowed from-gray-400 to-gray-600 hover:from-gray-400 hover:to-gray-600"
                            : ""
                    }`}
                    disabled={locked}
                >
                    {i18n("common:search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
