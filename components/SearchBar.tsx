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

    // TODO: CSS
    return (
        <div className="">
            <input
                type="text"
                className=""
                placeholder="Search for an artist or band"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch} className="">
                Search
            </button>
        </div>
    );
};

export default SearchBar;
