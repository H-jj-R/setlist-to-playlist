/**
 * Primary search bar
 */
import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center justify-center w-full mt-4 px-4">
            <div className="flex w-[70vw] max-w-xl">
                <input
                    type="text"
                    className="flex-1 h-12 py-2 px-4 rounded-l-lg text-lg border border-gray-300"
                    placeholder="Search for an artist/band or setlist.fm link..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSearch}
                    className="h-12 py-2 px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
