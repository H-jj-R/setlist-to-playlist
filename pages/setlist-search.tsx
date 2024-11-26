import React, { CSSProperties, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
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
    const router = useRouter();
    const [state, setState] = useState({
        searchTriggered: false, // Indicates if a search has been triggered
        searchComplete: false, // Indicates if the search is complete
        allSetlistsData: [], // Holds all fetched setlists
        setlistChosen: false, // Indicates if a specific setlist is selected
        chosenSetlistData: [] // Holds data of the chosen setlist
    });

    const [animLoading, setAnimLoading] = useState(true); // Controls animation for the loader
    const [showLoading, setShowLoading] = useState(false); // Indicates if the loading spinner should be displayed
    const [error, setError] = useState<string | null>(null); // Stores any error messages
    const [pageState, setPageState] = useState<"idle" | "shrinking" | "setlist" | "expanding">("idle");

    // Sync state with URL parameters
    useEffect(() => {
        const { query, setlist } = router.query;

        if (query && !setlist) {
            if (pageState !== "setlist") {
                handleSearch(query as string, null);
            }
        } else if (setlist && !query) {
            handleSearch(null, setlist as string);
        } else if (setlist && query) {
            if (!state.searchComplete) {
                handleSearch(query as string, setlist as string);
            } else {
                handleSetlistChosen(state.chosenSetlistData);
            }
        } else if (!query && !setlist) {
            // TODO: Handle neither (set page back to default when navigating back)
        }
    }, [router.query.query, router.query.setlist]);

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
    const handleSearchStart = async () => {
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
    const handleSearchComplete = async (data: any[]) =>
        setState((prev) => ({
            ...prev,
            searchComplete: true,
            allSetlistsData: data
        }));

    // Main search handler, fetches data based on the query and manages state
    const handleSearch = async (query: string, setlist: string) => {
        setError(null); // Clear any previous errors
        handleSearchStart(); // Reset state for new search

        // Delay showing the loader when search bar animation plays
        if (animLoading) {
            setTimeout(() => setAnimLoading(false), 750);
        }
        setShowLoading(true);

        try {
            if (setlist !== null && query === null) {
                const data = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlist}`);
                setShowLoading(false);
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    chosenSetlistData: data
                }));
                setPageState("setlist");
            } else if (query !== null && setlist === null) {
                // Fetch all setlists matching the search query
                const data = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                setShowLoading(false);
                handleSearchComplete(data);
            } else if (query !== null && setlist !== null) {
                const queryData = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                setShowLoading(false);
                handleSearchComplete(queryData);
                const setlistData = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlist}`);
                await handleSetlistChosen(setlistData);
            }
        } catch (err) {
            // Handle errors during the search process
            console.error("Error during search:", err);
            setShowLoading(false);
            setError(`Something went wrong. Please try again: ${err}`);
        }
    };

    // Updates the state when a specific setlist is chosen
    const handleSetlistChosen = async (setlist: any) => {
        console.log("Setlist chosen:", setlist);
        setPageState("setlist");
        setState((prev) => ({
            ...prev,
            setlistChosen: true,
            chosenSetlistData: setlist
        }));
    };

    // Returns to the list view from a chosen setlist
    const handleBackToList = async () => {
        await router.push(
            {
                pathname: "/setlist-search",
                query: { query: router.query.query }
            },
            undefined,
            { shallow: true }
        );

        setState((prev) => ({
            ...prev,
            setlistChosen: false,
            chosenSetlistData: null
        }));
        setPageState("idle");
    };

    // Renders the search bar with animations
    const renderSearchBar = () => {
        return (
            <div
                className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-[750ms] ease-in-out ${
                    state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                }`}
            >
                <SearchBar
                    onSearch={async (query: string) => {
                        if (!query) return;
                        if (query.startsWith("https://www.setlist.fm/setlist/")) {
                            // Extract setlist ID from the URL and fetch specific setlist data
                            const setlist = query.substring(query.lastIndexOf("-") + 1, query.lastIndexOf(".html"));
                            await router.push({ pathname: "/setlist-search", query: { setlist } }, undefined, {
                                shallow: true
                            });
                        } else {
                            await router.push({ pathname: "/setlist-search", query: { query } }, undefined, {
                                shallow: true
                            });
                        }
                    }}
                    aria-label="Search for setlists"
                />
            </div>
        );
    };

    // Renders a loading spinner when a search is in progress
    const renderLoading = () => {
        return (
            showLoading &&
            !animLoading && (
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
            !animLoading && (
                <div className="w-4/5 max-w-3xl mx-auto">
                    <ListOfSetlists
                        setlistData={state.allSetlistsData}
                        onSetlistChosen={async (setlist: any) => {
                            setState((prev) => ({
                                ...prev,
                                chosenSetlistData: setlist
                            }));
                            await router.push(
                                {
                                    pathname: "/setlist-search",
                                    query: { query: router.query.query, setlist: setlist.id }
                                },
                                undefined,
                                { shallow: true }
                            );
                        }}
                    />
                </div>
            )
        );
    };

    // Renders the selected setlist view
    const renderSetlist = () => {
        return (
            state.setlistChosen &&
            !animLoading && (
                <div className="w-full">
                    {pageState === "setlist" && (
                        <Setlist setlist={state.chosenSetlistData} onClose={handleBackToList} />
                    )}
                </div>
            )
        );
    };

    // Displays any error messages
    const renderError = () => error && <div className="pt-8 mt-5 text-red-500 text-center">{error}</div>;

    return (
        <Layout>
            <div className="p-5 overflow-hidden">
                {renderSearchBar()}
                {renderLoading()}
                {renderError()}
                <div className="flex gap-4 mt-14">
                    {renderListOfSetlists()}
                    {renderSetlist()}
                </div>
            </div>
        </Layout>
    );
}
