/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import PageState from "@constants/generateSetlistPageState";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **useGenerateSetlistHook**
 *
 * Custom hook for handling data and state management in the `/ai-generate-setlist` page.
 *
 * @returns Hook state and handlers.
 */
export default function useGenerateSetlistHook() {
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const { t: i18n } = useTranslation(); // Translation hook
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted
    const [state, setState] = useState({
        allSetlistsData: [] as Record<string, any>, // Stores all fetched setlists
        animLoading: true, // Controls when to begin loading animation visibility
        chosenSetlist: null as null | Record<string, any>, // Stores setlist selected for export
        error: null as null | string, // Stores error messages
        exportDialogOpen: false, // Tracks export dialog visibility
        pageState: PageState.Idle, // Manages different UI states
        predictedSetlists: null as null | Record<string, any>, // Stores all AI-generated setlists
        previousQuery: null as null | string, // Stores last searched query to avoid redundant calls
        progress: 0, // Tracks search and generation progress percentage
        searchComplete: false, // Indicates if the search process is complete
        searchTriggered: false, // Flags if a search has been initiated
        showAuthDialog: false, // Displays authentication dialog if needed
        showLoading: false // Controls overall loading state
    });

    /**
     * Effect hook that runs when the component mounts or theme changes.
     */
    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    /**
     * Handles searching for setlists based on a user query.
     *
     * @param {string} query - The search term entered by the user.
     */
    const handleSearch = useCallback(
        async (query: string): Promise<void> => {
            if (query === state.previousQuery) return; // Prevent redundant searches

            setState((prev) => ({ ...prev, previousQuery: query })); // Store the new query in state

            // Check if user is authenticated before proceeding with generation
            const response = await fetch("/api/controllers/check-for-authentication", {
                credentials: "include",
                method: "GET"
            });
            if (!response.ok) {
                if (response.status === 401) {
                    setState((prev) => ({ ...prev, showAuthDialog: true }));
                    return;
                }
            }

            // Reset state values for a fresh search
            setState((prev) => ({
                ...prev,
                error: null,
                pageState: PageState.Idle,
                progress: 0,
                searchComplete: false,
                searchTriggered: true,
                showLoading: false
            }));

            // Delays the loading animation slightly to account for search bar animation
            if (state.animLoading) {
                setTimeout((): void => setState((prev) => ({ ...prev, animLoading: false })), 750);
            }
            setState((prev) => ({ ...prev, showLoading: true }));

            try {
                setState((prev) => ({ ...prev, progress: 0 }));
                await new Promise((t): NodeJS.Timeout => setTimeout(t, 500)); // Timeout used to show the loading bar starting at 0%

                // Check if the user has exceeded query limits
                const queryLimitResponse = await fetch(`/api/database/check-query-limit`, {
                    headers: {
                        Authorization: `Bearer ${localStorage?.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                });
                if (!queryLimitResponse.ok) {
                    const errorResponse = await queryLimitResponse.json();
                    throw {
                        error: i18n(errorResponse.error) || i18n("common:unexpectedError"),
                        status: queryLimitResponse.status
                    };
                }
                setState((prev) => ({ ...prev, progress: 10 }));

                // Fetch first page of setlists from setlist.fm based on the query
                const setlistResponse = await fetch(
                    `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
                );
                if (!setlistResponse.ok) {
                    const errorResponse = await setlistResponse.json();
                    throw {
                        error: i18n(errorResponse.error) || i18n("common:unexpectedError"),
                        status: setlistResponse.status
                    };
                }
                const setlistData = await setlistResponse.json();
                setState((prev) => ({ ...prev, allSetlistsData: setlistData, progress: 15 }));

                // Simulate gradual progress while waiting for OpenAI API response
                let simulatedProgress = 15;
                const interval = setInterval((): void => {
                    simulatedProgress += 5;
                    setState((prev) => ({ ...prev, progress: simulatedProgress }));
                    if (simulatedProgress >= 95) {
                        clearInterval(interval);
                    }
                }, 1000);

                // Send fetched setlists to OpenAI API to predict future setlists
                const openAIResponse = await fetch("/api/openai/predict-setlist", {
                    body: JSON.stringify({ pastSetlists: setlistData.setlists.setlist }),
                    headers: {
                        Authorization: `Bearer ${localStorage?.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                });
                if (!openAIResponse.ok) {
                    const errorResponse = await openAIResponse.json();
                    throw {
                        error: i18n(errorResponse.error) || i18n("common:unexpectedError"),
                        status: openAIResponse.status
                    };
                }
                const openAIData = await openAIResponse.json();

                clearInterval(interval);
                setState((prev) => ({ ...prev, progress: 100 }));
                await new Promise((t): NodeJS.Timeout => setTimeout(t, 500)); // Timeout used to show the loading bar getting to 100%

                // Update UI with the predicted setlists
                setState((prev) => ({
                    ...prev,
                    pageState: PageState.Setlist,
                    predictedSetlists: Object.values(openAIData.predictedSetlists).map(
                        (predictedSetlist: Record<string, any>) => ({
                            ...predictedSetlist,
                            setlistArtist: setlistData.spotifyArtist
                        })
                    ),
                    searchComplete: true
                }));
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    error: error.error
                }));
            } finally {
                setState((prev) => ({
                    ...prev,
                    progress: 0,
                    showLoading: false
                }));
            }
        },
        [state]
    );

    /**
     * Opens the export dialog and sets the selected setlist.
     *
     * @param {Record<string, any>} setlist - The setlist to be exported.
     */
    const handleExport = useCallback(async (setlist: Record<string, any>): Promise<void> => {
        setState((prev) => ({
            ...prev,
            chosenSetlist: setlist,
            exportDialogOpen: true
        }));
    }, []);

    /**
     * Combines multiple predicted setlists into a single merged setlist.
     */
    const handleCombineSetlists = useCallback(async (): Promise<void> => {
        if (!state.predictedSetlists || state.predictedSetlists.length === 0) return; // Ensure there's at least one setlist before proceeding
        const setlistArtist = state.predictedSetlists[0].setlistArtist; // Extract the artist from the first setlist (as they are all same artist)

        // Assert state.predictedSetlists (Record<string, any>) to new type
        const setlistsArray = state.predictedSetlists as Array<{
            predictedSongs: { artist: string; name: string; tape: boolean }[];
            setlistArtist: Record<string, any>;
        }>;

        // Map which stores unique songs while preserving insertion order
        const songMap = new Map<string, { artist: string; name: string; tape: boolean }>();

        // Find the maximum setlist length for round-robin merging
        const maxLength: number = Math.max(
            ...state.predictedSetlists.map((s: Record<string, any>): number => s.predictedSongs.length)
        );

        // Merge songs while preserving round-robin order
        for (let i = 0; i < maxLength; i++) {
            for (const setlist of setlistsArray) {
                if (i < setlist.predictedSongs.length) {
                    const song = setlist.predictedSongs[i];
                    if (!songMap.has(song.name)) {
                        songMap.set(song.name, song);
                    }
                }
            }
        }
        const mergedSongs = Array.from(songMap.values()); // Extract merged songs in insertion order
        handleExport({ predictedSongs: mergedSongs, setlistArtist }); // Open export dialog with the merged setlists
    }, [state, handleExport]);

    return {
        handleCombineSetlists,
        handleExport,
        handleSearch,
        mounted,
        setState,
        state
    };
}
