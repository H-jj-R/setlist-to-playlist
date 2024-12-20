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
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18n } = useTranslation("setlist-search");
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
                    placeholder={i18n("searchForSetlist")}
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
                    className={`h-12 py-2 px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 ${
                        locked ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
                    }`}
                    disabled={locked}
                >
                    {i18nCommon("search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
