/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import PageState from "@constants/setlistSearchPageState";
import SettingsKeys from "@constants/settingsKeys";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **useSetlistSearchHook**
 *
 * Custom hook for handling data and state management in the `/setlist-search` page.
 *
 * @returns Hook state and handlers.
 */
export default function useSetlistSearchHook() {
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const router = useRouter(); // Router hook
    const { t: i18n } = useTranslation(); // Translation hook
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted
    const [state, setState] = useState({
        allSetlistsData: [] as Record<string, any>, // Stores fetched setlists data
        animLoading: true, // Controls when to begin loading animation visibility
        chosenSetlistData: null as null | Record<string, any>, // Stores a selected setlist
        countryFilter: "" as string, // Stores the country filter preference
        error: null as null | string, // Stores error messages
        exportDialogOpen: false, // Controls the visibility of the export dialog
        mergedSetlistData: null as null | Record<string, any>, // Stores combined songs from multiple setlists
        pageState: PageState.Idle, // Manages different UI states
        previousQuery: null as null | string, // Stores the last performed search query to avoid redundant calls
        searchComplete: false, // Tracks if a search operation has finished
        searchTriggered: false, // Tracks if a search operation has triggered
        setlistChosen: false, // Indicates whether a setlist has been selected
        showAuthDialog: false, // Controls Spotify authentication dialog visibility
        showLoading: false // Manages loading state during API calls
    });

    /**
     * Effect hook to initialise theme settings and retrieve stored country filter when the component mounts.
     */
    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
        setState((prev) => ({
            ...prev,
            countryFilter: localStorage?.getItem(SettingsKeys.CountryFilter)
        }));
    }, [resolvedTheme]);

    /**
     * Effect hook to listen for changes in local storage and update the country filter accordingly.
     */
    useEffect((): (() => void) => {
        const handleStorageChange = (): void => {
            setState((prev) => ({
                ...prev,
                countryFilter: localStorage?.getItem(SettingsKeys.CountryFilter)
            }));
        };

        // Listen for changes to the CountryFilter setting
        window.addEventListener(SettingsKeys.CountryFilter, handleStorageChange);

        // Cleanup listener when the component unmounts
        return (): void => {
            window.removeEventListener(SettingsKeys.CountryFilter, handleStorageChange);
        };
    }, []);

    /**
     * Effect hook to automatically trigger a new search if the country filter updates.
     */
    useEffect((): void => {
        const { q } = router.query;
        if (q) {
            if (state.pageState !== PageState.LosSetlist || q !== state.previousQuery) {
                handleSearch(q as string, null);
            } else if (state.pageState === PageState.LosSetlist) {
                handleBackToList();
                handleSearch(q as string, null);
            }
        }
    }, [state.countryFilter]);

    /**
     * Effect hook which triggers a UI update whenever the router updates.
     */
    useEffect((): void => {
        const { q, setlist } = router.query;

        if (q && !setlist) {
            if (state.pageState !== PageState.LosSetlist || q !== state.previousQuery) {
                handleSearch(q as string, null); // Trigger a new search
            }
        } else if (setlist && !q) {
            handleSearch(null, setlist as string); // Fetch specific setlist
        } else if (setlist && q) {
            if (!state.searchComplete) {
                handleSearch(q as string, setlist as string); // Search the query and set the setlist
            } else {
                setState((prev) => ({ ...prev, pageState: PageState.LosSetlist, setlistChosen: true }));
            }
        } else {
            setState((prev) => ({ ...prev, animLoading: true, pageState: PageState.Idle, searchTriggered: false }));
        }

        // Store the current query for future reference
        setState((prev) => ({ ...prev, previousQuery: router.query.q as string }));
    }, [router.query.q, router.query.setlist]);

    /**
     * Fetches data from a given API URL and handles errors.
     *
     * @param {string} url The endpoint to fetch data from.
     * @returns {Promise<Record<string, any>>} A promise resolving to the fetched data.
     */
    const fetchData = async (url: string): Promise<Record<string, any>> => {
        const response = await fetch(url);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw {
                error: i18n(errorResponse.error) || i18n("common:unexpectedError"),
                status: response.status
            };
        }
        return (await response.json()) as Record<string, any>;
    };

    /**
     * Handles searching for setlists based on provided query parameters.
     *
     * @param {null | string} query The search term provided by the user.
     * @param {null | string} setlist The specific setlist ID to fetch (if applicable).
     */
    const handleSearch = async (query: null | string, setlist: null | string): Promise<void> => {
        // Reset search-related state before making API requests
        setState((prev) => ({
            ...prev,
            chosenSetlistData: null,
            error: null,
            searchComplete: false,
            searchTriggered: true,
            setlistChosen: false,
            showLoading: false
        }));

        // Delays the loading animation slightly to account for search bar animation
        if (state.animLoading) {
            setTimeout((): void => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }
        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            if (query && !setlist) {
                // Fetch setlists based on a user search query
                const data = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ country: state.countryFilter, query }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    allSetlistsData: data,
                    pageState: PageState.ListOfSetlists,
                    searchComplete: true,
                    showLoading: false
                }));
            } else if (!query && setlist) {
                // Fetch details for a specific setlist by ID
                const setlistData = await fetchData(
                    `/api/setlist-fm/setlist-setlistid?${new URLSearchParams({ setlistId: setlist }).toString()}`
                );
                // Fetch artist details from Spotify
                const artistData = await fetchData(
                    `/api/spotify/search-artist?${new URLSearchParams({ query: setlistData.artist.name }).toString()}`
                );
                const fullArtistDetails = { setlistfmArtist: setlistData.artist, spotifyArtist: artistData };

                setState((prev) => ({
                    ...prev,
                    allSetlistsData: fullArtistDetails,
                    chosenSetlistData: setlistData,
                    pageState: PageState.Setlist,
                    setlistChosen: true,
                    showLoading: false
                }));
            } else if (query && setlist) {
                // Fetch search results and specific setlist details together.
                const queryData = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ country: state.countryFilter, query }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    allSetlistsData: queryData,
                    searchComplete: true,
                    showLoading: false
                }));
                const setlistData = await fetchData(
                    `/api/setlist-fm/setlist-setlistid?${new URLSearchParams({ setlistId: setlist }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    chosenSetlistData: setlistData,
                    pageState: PageState.LosSetlist,
                    setlistChosen: true
                }));
            }
        } catch (error) {
            setState((prev) => ({ ...prev, error: error.error, showLoading: false }));
        }
    };

    /**
     * Handles pushing the search query to the router's URL.
     *
     * @param {string} query The search query (either setlist URL or search query).
     */
    const handleSearchRouterPush = useCallback(
        async (query: string): Promise<void> => {
            if (!query) return; // Don't proceed if no query is provided

            // If the query is a setlist URL, extract the setlist ID. Otherwise, treat it as a search term
            const queryParams = query.includes("setlist.fm/setlist/")
                ? { setlist: query.split("-").pop()?.replace(".html", "") }
                : { q: query };

            // Update the URL with the search or setlist ID using shallow routing to avoid a full page reload
            await router.push({ pathname: "/setlist-search", query: queryParams }, undefined, { shallow: true });
        },
        [router]
    );

    /**
     * Handles pushing the chosen setlist's details to the router and updating the state with the selected setlist.
     *
     * @param {Record<string, any>} setlist The setlist object that was selected.
     */
    const handleSetlistChosenRouterPush = useCallback(
        async (setlist: Record<string, any>): Promise<void> => {
            setState((prev) => ({ ...prev, chosenSetlistData: setlist }));

            // Push the selected setlist's ID to the URL, along with the search query if available
            await router.push(
                { pathname: "/setlist-search", query: { q: router.query.q, setlist: setlist.id } },
                undefined,
                { shallow: true }
            );
        },
        [router]
    );

    /**
     * Navigates back to the list of setlists by updating the URL with the search query and resetting state.
     */
    const handleBackToList = useCallback(async (): Promise<void> => {
        // Push the current search query back to the URL, omitting the setlist ID.
        await router.push({ pathname: "/setlist-search", query: { q: router.query.q } }, undefined, { shallow: true });
        setState((prev) => ({
            ...prev,
            chosenSetlistData: null,
            pageState: PageState.ListOfSetlists,
            setlistChosen: false
        }));
    }, [router]);

    /**
     * Checks the user's Spotify authentication status, then shows the export dialog.
     */
    const handleExport = useCallback(async (): Promise<void> => {
        try {
            // Send a request to check if the user is authenticated
            const response = await fetch("/api/controllers/check-for-authentication", {
                credentials: "include", // Ensure the request includes client-side cookies
                method: "GET"
            });

            if (response.status === 200) {
                setState((prev) => ({ ...prev, exportDialogOpen: true })); // Show the export dialog
            } else if (response.status === 401) {
                setState((prev) => ({ ...prev, showAuthDialog: true })); // Show the Spotify authentication dialog
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    /**
     * Combines all setlists into a single setlist for exporting to Spotify.
     *
     * @param {Record<string, any>} allSetlists - All loaded setlists to combine
     */
    const handleCombineSetlists = useCallback(
        async (allSetlists: Record<string, any>): Promise<void> => {
            // Map each setlist to its song array, defaulting to an empty array if not present.
            const setsArray = allSetlists.map((setlist: Record<string, any>) => setlist.sets?.set?.[0]?.song ?? []);
            const songSet = new Set<string>(); // Use a Set to track unique song names to avoid duplicates.
            const mergedSongs: Record<string, any>[] = []; // Array used to accumulate unique tracks from all setlists.

            // Loop over indices while at least one set in setsArray still has songs at index i.
            for (let i = 0; setsArray.some((set: Record<string, any>): boolean => i < set.length); i++) {
                // For each set, get the song at the current index (if it exists).
                setsArray.forEach((set: Record<string, any>): void => {
                    const track = set[i];
                    if (track && !songSet.has(track.name)) {
                        // Mark the song as added and push it to the mergedSongs array.
                        songSet.add(track.name);
                        mergedSongs.push(track);
                    }
                });
            }
            setState((prev) => ({ ...prev, mergedSetlistData: { sets: { set: [{ song: mergedSongs }] } } }));
            await handleExport();
        },
        [handleExport]
    );

    return {
        handleBackToList,
        handleCombineSetlists,
        handleExport,
        handleSearchRouterPush,
        handleSetlistChosenRouterPush,
        mounted,
        setState,
        state
    };
}
