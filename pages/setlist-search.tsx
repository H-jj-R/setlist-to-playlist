import React, { CSSProperties, useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ListOfSetlists from "../components/ListOfSetlists";
import { CSSTransition } from "react-transition-group";
import utilStyles from "../styles/utils.module.css";
import HashLoader from "react-spinners/HashLoader";
import Setlist from "../components/Setlist";

/**
 * Main page for viewing setlists.
 */
export default function SetlistSearch() {
    const [state, setState] = useState({
        searchTriggered: false, // Indicates if a search has been triggered
        searchComplete: false, // Indicates if the search is complete
        allSetlistsData: [], // Holds all fetched setlists
        setlistChosen: false, // Indicates if a specific setlist is selected
        chosenSetlistData: [] // Holds data of the chosen setlist
    });

    // State for managing animation/loading indicators and error messages
    const [animLoading, setAnimLoading] = useState(false); // Controls animation for the loader
    const [showLoading, setShowLoading] = useState(false); // Indicates if the loading spinner should be displayed
    const [error, setError] = useState<string | null>(null); // Stores any error messages

    // Helper function to fetch data from a given URL and handle errors
    const fetchData = async (url: string) => {
        const response = await fetch(url);

        // Check if the API response is not OK (e.g. 4xx or 5xx status codes)
        if (!response.ok) {
            // Get the error details from the response
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error?.message || "Unknown error";
            throw new Error(`${response.status}: Failed to fetch data - Error: ${errorMessage}`);
        }
        return response.json();
    };

    // Triggered when the user initiates a new search
    const handleSearchStart = () => {
        setState((prev) => ({
            ...prev,
            searchTriggered: true,
            searchComplete: false,
            setlistChosen: false,
            chosenSetlistData: null
        }));
        setShowLoading(false);
    };

    // Updates the state with the fetched setlist data after a successful search
    const handleSearchComplete = (data: any[]) =>
        setState((prev) => ({
            ...prev,
            searchComplete: true,
            allSetlistsData: data
        }));

    // Main search handler, fetches data based on the query and manages state
    const handleSearch = async (query: string) => {
        if (!query) return; // No action if query is empty

        setError(null); // Clear any previous errors
        handleSearchStart(); // Reset state for new search

        // Delay showing the loader when search bar animation plays
        if (!animLoading) {
            setTimeout(() => setAnimLoading(true), 750);
        }

        setShowLoading(true);
        try {
            if (query.startsWith("https://www.setlist.fm/setlist/")) {
                // Extract setlist ID from the URL and fetch specific setlist data
                const setlistId = query.substring(query.lastIndexOf("-") + 1, query.lastIndexOf(".html"));
                const data = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlistId}`);
                console.log("Setlist data from link:", data);
                setShowLoading(false);
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    chosenSetlistData: data
                }));
            } else {
                // Fetch all setlists matching the search query
                const data = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                setShowLoading(false);
                handleSearchComplete(data);
            }
        } catch (err) {
            // Handle errors during the search process
            console.error("Error during search:", err);
            setShowLoading(false);
            setError("Something went wrong. Please try again.");
        }
    };

    // Updates the state when a specific setlist is chosen
    const handleSetlistChosen = async (setlist: any) => {
        console.log("Setlist chosen:", setlist);
        setState((prev) => ({
            ...prev,
            setlistChosen: true,
            chosenSetlistData: setlist
        }));
    };

    // Returns to the list view from a chosen setlist
    const handleBackToList = () => {
        setState((prev) => ({
            ...prev,
            setlistChosen: false,
            chosenSetlistData: null
        }));
    };

    // Renders the search bar with animations
    const renderSearchBar = () => {
        return (
            <CSSTransition
                in={state.searchTriggered}
                timeout={750}
                classNames={{
                    enter: utilStyles["searchbar-enter"],
                    enterActive: utilStyles["searchbar-enter-active"],
                    enterDone: utilStyles["searchbar-enter-done"]
                }}
            >
                <div className={utilStyles.searchbar}>
                    <SearchBar onSearch={handleSearch} aria-label="Search for setlists" />
                </div>
            </CSSTransition>
        );
    };

    // Renders a loading spinner when a search is in progress
    const renderLoading = () => {
        return (
            showLoading &&
            animLoading && (
                <div className="pt-8 mt-16 flex justify-center items-center">
                    <HashLoader
                        color={"#36d7c0"}
                        loading={showLoading}
                        cssOverride={{} as CSSProperties}
                        size={150}
                        aria-label="Loader"
                        data-testid="loader"
                    />
                </div>
            )
        );
    };

    // Renders the list of setlists if the search is complete
    const renderListOfSetlists = () => {
        return (
            state.searchComplete &&
            animLoading && (
                <div className="pt-8 mt-5 w-4/5 max-w-3xl mx-auto">
                    <ListOfSetlists setlistData={state.allSetlistsData} onSetlistChosen={handleSetlistChosen} />
                </div>
            )
        );
    };

    // Renders the selected setlist view
    const renderSetlist = () => {
        return (
            state.setlistChosen &&
            animLoading && (
                <div className="pt-8 mt-5 w-4/5 max-w-3xl mx-auto">
                    <Setlist setlist={state.chosenSetlistData} onClose={handleBackToList} />
                </div>
            )
        );
    };

    // Displays any error messages
    const renderError = () => error && <div className="pt-8 mt-5 text-red-500 text-center">{error}</div>;

    // Main render function for the component
    return (
        <Layout>
            <div className="p-5">
                {renderSearchBar()}
                {renderLoading()}
                {renderError()}
                {renderListOfSetlists()}
                {renderSetlist()}
            </div>
        </Layout>
    );
}
