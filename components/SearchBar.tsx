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

    // TODO: Tailwind CSS config not working :(   
    return (
        <div className="flex items-center max-w-lg mx-auto mt-4">
            <input
                type="text"
                className="w-full py-3 px-4 rounded-l-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for an artist/band or setlist.fm link..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button
                onClick={handleSearch}
                className="py-3 px-6 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;
