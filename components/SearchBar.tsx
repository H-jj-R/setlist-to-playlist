import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Primary search bar component.
 * This component allows users to search for artists/bands or setlist.fm links.
 *
 * @param {Function} onSearch - Callback function passed down to handle the search action when the user submits a query.
 */
const SearchBar = ({ onSearch }) => {
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18n } = useTranslation("setlist-search");

    // State to store the current value of the search query
    const [query, setQuery] = useState("");

    // Handle input changes and update the query state
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle the search button click event
    const handleSearch = () => {
        onSearch(query);
    };

    // If the Enter key is pressed, trigger the search action
    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center justify-center w-full mt-4 px-2 sm:px-4">
            <div className="flex w-full sm:w-[70vw] max-w-xl">
                <input
                    type="text"
                    className="flex-1 h-12 py-2 px-4 rounded-l-lg text-lg border border-gray-300"
                    placeholder={i18n("searchForSetlist")}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyUp}
                />
                <button
                    onClick={handleSearch}
                    className="h-12 py-2 px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600"
                >
                    {i18nCommon("search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
