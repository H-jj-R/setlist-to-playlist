/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
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
 *
 * @returns The rendered `SearchBar` component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ isPredicted, locked, onSearch }) => {
    const { t: i18n } = useTranslation(); // Translation hook
    const [query, setQuery] = useState(""); // State to track the user's search input
    const [isListening, setIsListening] = useState(false); // Tracks whether microphone input is currently active
    const recognitionRef = useRef(null); // Stores reference to webkit speech recognition API

    /**
     * Handles voice search using the browser's built-in speech recognition API.
     */
    const handleVoiceSearch = (): void => {
        if (!("webkitSpeechRecognition" in window)) return;

        // Initialise recognition if it's not already created
        if (!recognitionRef.current) {
            recognitionRef.current = new (window as any).webkitSpeechRecognition();
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = (): void => setIsListening(true);
            recognitionRef.current.onend = (): void => setIsListening(false);
            recognitionRef.current.onresult = (event: any): void => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                onSearch(transcript);
            };
        }

        // Toggle recognition on/off
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    return (
        <div id="search-container" className="mt-4 flex w-full items-center justify-center px-2 sm:px-4" role="search">
            <div id="search-input-wrapper" className="flex w-full max-w-xl sm:w-[70vw]">
                <input
                    id="search-input"
                    className="h-12 flex-1 rounded-l-lg border border-gray-300 bg-white px-4 py-2 text-lg dark:bg-black"
                    aria-label={i18n("common:search")}
                    autoComplete="off"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setQuery(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                        if (e.key === "Enter" && !locked) onSearch(query);
                    }}
                    placeholder={`${
                        !isPredicted ? i18n("setlistSearch:searchForSetlist") : i18n("generateSetlist:searchForArtist")
                    }...`}
                    role="searchbox"
                    type="text"
                    value={query}
                />
                <button
                    id="mic-btn"
                    className={`relative flex h-12 w-12 items-center justify-center border-y border-gray-300 bg-gray-200 text-gray-700 transition hover:cursor-pointer hover:bg-gray-300 ${
                        locked ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    aria-label={
                        isListening ? i18n("setlistSearch:stopListening") : i18n("setlistSearch:startVoiceSearch")
                    }
                    disabled={locked}
                    onClick={handleVoiceSearch}
                    role="button"
                >
                    <div
                        id="mic-btn-listening-animation"
                        className={`pointer-events-none absolute inset-0 rounded border-4 border-red-500 shadow-inner shadow-red-500/50 transition-opacity duration-300 ${
                            isListening ? "animate-pulse opacity-100" : "opacity-0"
                        }`}
                        style={{ animationDelay: isListening ? "300ms" : "0ms" }}
                    />
                    <FontAwesomeIcon
                        id="fa-microphone-icon"
                        className={`relative transition duration-300 ${isListening ? "text-red-500" : "text-gray-700"}`}
                        icon={faMicrophone}
                        size="lg"
                    />
                </button>
                <button
                    id="search-btn"
                    className={`h-12 rounded-r-lg bg-linear-to-bl from-blue-400 to-blue-600 px-6 py-2 font-semibold text-white transition hover:cursor-pointer hover:from-blue-500 hover:to-blue-700 ${
                        locked
                            ? "cursor-not-allowed from-gray-400 to-gray-600 hover:from-gray-400 hover:to-gray-600"
                            : ""
                    }`}
                    disabled={locked}
                    onClick={(): void => onSearch(query)}
                    role="button"
                >
                    {i18n("common:search")}
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
