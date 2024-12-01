import React, { CSSProperties, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import SearchBar from "../components/SearchBar";
import ListOfSetlists from "../components/ListOfSetlists";
import HashLoader from "react-spinners/HashLoader";
import Setlist from "../components/Setlist";
import ExportDialog from "../components/ExportDialog";
import { useTheme } from "next-themes";

/**
 * Main page for viewing setlists.
 */
export default function SetlistSearch() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [state, setState] = useState({
        mounted: false as boolean,
        searchTriggered: false as boolean,
        searchComplete: false as boolean,
        lastQuery: null as string | null,
        allSetlistsData: [] as any,
        setlistChosen: false as boolean,
        chosenSetlistData: null as any,
        exportDialogOpen: false as boolean,
        animLoading: true as boolean,
        showLoading: false as boolean,
        error: null as string | null,
        pageState: "idle" as "idle" | "listOfSetlists" | "losSetlist" | "setlist"
    });

    useEffect(() => {
        setState((prev) => ({
            ...prev,
            mounted: true
        }));
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    useEffect(() => {
        const { q, setlist } = router.query;
        if (q && !setlist) {
            if (state.pageState !== "losSetlist" || q !== state.lastQuery) {
                handleSearch(q as string, null);
            }
        } else if (setlist && !q) {
            handleSearch(null, setlist as string);
        } else if (setlist && q) {
            if (!state.searchComplete) {
                handleSearch(q as string, setlist as string);
            } else {
                handleSetlistChosen(state.chosenSetlistData);
                setState((prev) => ({
                    ...prev,
                    pageState: "losSetlist"
                }));
            }
        } else {
            setState((prev) => ({
                ...prev,
                searchTriggered: false,
                animLoading: true,
                pageState: "idle"
            }));
        }
        setState((prev) => ({
            ...prev,
            lastQuery: router.query.q as string
        }));
    }, [router.query.q, router.query.setlist]);

    const fetchData = async (url: string) => {
        const response = await fetch(url);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(
                `${response.status}: Failed to fetch data - Error: ${errorResponse.error?.message || "Unknown error"}`
            );
        }
        return await response.json();
    };

    const handleSearchStart = () => {
        setState((prev) => ({
            ...prev,
            searchTriggered: true,
            searchComplete: false,
            setlistChosen: false,
            chosenSetlistData: null,
            showLoading: false
        }));
    };

    const handleSearchComplete = (data: any[]) => {
        setState((prev) => ({
            ...prev,
            searchComplete: true,
            allSetlistsData: data
        }));
    };

    const handleSearch = async (query: string | null, setlist: string | null) => {
        setState((prev) => ({
            ...prev,
            error: null
        }));
        handleSearchStart();

        if (state.animLoading) {
            setTimeout(
                () =>
                    setState((prev) => ({
                        ...prev,
                        animLoading: false
                    })),
                750
            );
        }

        setState((prev) => ({
            ...prev,
            showLoading: true
        }));

        try {
            if (query && !setlist) {
                const data = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                handleSearchComplete(data);
                setState((prev) => ({
                    ...prev,
                    showLoading: false,
                    pageState: "listOfSetlists"
                }));
            } else if (!query && setlist) {
                const data = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlist}`);
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    chosenSetlistData: data,
                    showLoading: false,
                    pageState: "setlist"
                }));
            } else if (query && setlist) {
                const queryData = await fetchData(`/api/controllers/get-setlists?query=${query}`);
                setState((prev) => ({
                    ...prev,
                    showLoading: false
                }));
                handleSearchComplete(queryData);
                const setlistData = await fetchData(`/api/setlist-fm/setlist-setlistid?setlistId=${setlist}`);
                handleSetlistChosen(setlistData);
                setState((prev) => ({
                    ...prev,
                    pageState: "losSetlist"
                }));
            }
        } catch (err) {
            console.error("Error during search:", err);
            setState((prev) => ({
                ...prev,
                showLoading: false,
                error: `Something went wrong. Please try again: ${err}`
            }));
        }
    };

    const handleSetlistChosen = (setlist: any) => {
        setState((prev) => ({
            ...prev,
            setlistChosen: true,
            chosenSetlistData: setlist
        }));
    };

    const handleBackToList = async () => {
        await router.push(
            {
                pathname: "/setlist-search",
                query: { q: router.query.q }
            },
            undefined,
            { shallow: true }
        );
        setState((prev) => ({
            ...prev,
            setlistChosen: false,
            chosenSetlistData: null,
            pageState: "listOfSetlists"
        }));
    };

    const handleExport = async () => {
        try {
            // Check the user's token status
            const response = await fetch("/api/controllers/check-for-user-token", {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 200) {
                // User is authorised, proceed with export dialog
                setState((prev) => ({
                    ...prev,
                    exportDialogOpen: true
                }));
            } else if (response.status === 401) {
                // User needs to authorise, open Spotify OAuth
                const redirectState = encodeURIComponent(window.location.pathname + window.location.search);
                router.push(`/api/spotify/authorise?redirect=${redirectState}`);
            } else {
                // Handle other potential errors
                console.error("Unexpected response from checking user token:", response.status);
            }
        } catch (error) {
            console.error("Error checking authorisation:", error);
        }
    };

    if (!state.mounted) return null;

    return (
        <>
            <Layout>
                {/* Search bar */}
                <div className="p-5 overflow-hidden">
                    <div
                        className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-[750ms] ease-in-out ${
                            state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                        }`}
                    >
                        <SearchBar
                            onSearch={async (query: string) => {
                                if (!query) {
                                    return;
                                }
                                const setlistId = query.startsWith("https://www.setlist.fm/setlist/")
                                    ? query.split("-").pop()?.replace(".html", "")
                                    : null;
                                await router.push(
                                    {
                                        pathname: "/setlist-search",
                                        query: { q: setlistId || query }
                                    },
                                    undefined,
                                    { shallow: true }
                                );
                            }}
                            aria-label="Search for setlists"
                        />
                    </div>

                    {/* Loading indicator */}
                    {state.showLoading && !state.animLoading && (
                        <div className="pt-8 mt-16 flex justify-center items-center">
                            <HashLoader
                                color="#36d7c0"
                                loading={state.showLoading}
                                size={150}
                                aria-label="Loader"
                                data-testid="loader"
                            />
                        </div>
                    )}

                    {state.pageState !== "idle" && (
                        <>
                            {/* Error indicator */}
                            {state.error && <div className="pt-8 mt-5 text-red-500 text-center">{state.error}</div>}

                            <div className="flex gap-4 mt-[3rem]">
                                {/* List of setlists */}
                                {state.searchComplete && !state.animLoading && (
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
                                                        query: { q: router.query.q, setlist: setlist.id }
                                                    },
                                                    undefined,
                                                    { shallow: true }
                                                );
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Setlist display */}
                                {((state.setlistChosen && !state.animLoading && state.pageState === "losSetlist") ||
                                    state.pageState === "setlist") && (
                                    <div className="w-full">
                                        <Setlist
                                            setlist={state.chosenSetlistData}
                                            onClose={handleBackToList}
                                            onExport={handleExport}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Layout>
            <ExportDialog
                setlist={state.chosenSetlistData}
                isOpen={state.exportDialogOpen}
                onClose={async () => {
                    setState((prev) => ({
                        ...prev,
                        exportDialogOpen: false
                    }));
                }}
            />
        </>
    );
}
