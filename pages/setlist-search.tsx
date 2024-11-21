import React, { CSSProperties, useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ListOfSetlists from "../components/ListOfSetlists";
import { CSSTransition } from "react-transition-group";
import utilStyles from "../styles/utils.module.css";
import HashLoader from "react-spinners/HashLoader";

export default function SetlistSearch() {
    const [state, setState] = useState({
        searchTriggered: false,
        searchComplete: false,
        setlistData: []
    });
    const [animLoading, setAnimLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false); // Separate state for delayed loading visibility
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("There has been an error!");
        }
        return response.json();
    };

    const handleSearchStart = () => {
        setState((prev) => ({
            ...prev,
            searchTriggered: true,
            searchComplete: false
        }));
        setShowLoading(false); // Reset showLoading when a new search starts
    };

    const handleSearchComplete = (data: any[]) =>
        setState((prev) => ({
            ...prev,
            searchComplete: true,
            setlistData: data
        }));

    const handleSearch = async (query: string) => {
        if (!query) return;

        setError(null); // Reset error
        handleSearchStart();

        // Delay showing the loading indicator
        setTimeout(() => setAnimLoading(true), 1000); // Show loading only after 1 second

        setShowLoading(true);
        try {
            if (query.startsWith("https://www.setlist.fm/setlist/")) {
                const setlistId = query.substring(query.lastIndexOf("-") + 1, query.lastIndexOf(".html"));
                const data = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlistId}`);
                console.log("Setlist data from link:", data);
                setShowLoading(false);
                // TODO: Use data to show setlist
            } else {
                const data = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                setShowLoading(false);
                handleSearchComplete(data);
            }
        } catch (err) {
            console.error("Error during search:", err);
            setShowLoading(false);
            setError("Something went wrong. Please try again.");
        }
    };

    const handleSetlistChosen = async (setlist: any) => {
        console.log("Setlist chosen:", setlist);
    };

    const renderSearchBar = () => (
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

    const renderLoading = () =>
        showLoading &&
        animLoading && (
            <div className="pt-8 mt-8 flex justify-center items-center">
                <HashLoader
                    color={"#ffffff"}
                    loading={showLoading}
                    cssOverride={{} as CSSProperties}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        );

    const renderListOfSetlists = () =>
        state.searchComplete && (
            <div className="pt-8 mt-5 w-4/5 max-w-3xl mx-auto">
                <ListOfSetlists setlistData={state.setlistData} onSetlistChosen={handleSetlistChosen} />
            </div>
        );

    const renderError = () => error && <div className="pt-8 mt-5 text-red-500 text-center">{error}</div>;

    return (
        <Layout>
            <div className="p-5">
                {renderSearchBar()}
                {renderLoading()}
                {renderError()}
                {renderListOfSetlists()}
            </div>
        </Layout>
    );
}
