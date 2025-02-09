/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import PageState from "@constants/generateSetlistPageState";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the setlist-search page.
 */
export default function generateSetlistHook() {
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        allSetlistsData: [] as Record<string, any>,
        animLoading: true,
        chosenSetlist: null as null | Record<string, any>,
        error: null as null | string,
        exportDialogOpen: false,
        pageState: PageState.Idle,
        predictedSetlists: null as null | Record<string, any>,
        previousQuery: null as null | string,
        progress: 0,
        searchComplete: false,
        searchTriggered: false,
        showAuthDialog: false,
        showLoading: false
    });

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    const handleSearch = async (query: string) => {
        if (query === state.previousQuery) {
            return;
        }
        setState((prev) => ({ ...prev, previousQuery: query }));
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

        setState((prev) => ({
            ...prev,
            error: null,
            pageState: PageState.Idle,
            progress: 0,
            searchComplete: false,
            searchTriggered: true,
            showLoading: false
        }));

        if (state.animLoading) {
            setTimeout(() => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }

        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            setState((prev) => ({ ...prev, progress: 0 }));
            await new Promise((t) => setTimeout(t, 500));
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
            const interval = setInterval(() => {
                simulatedProgress += 5;
                setState((prev) => ({ ...prev, progress: simulatedProgress }));
                if (simulatedProgress >= 95) {
                    clearInterval(interval);
                }
            }, 600);

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
            await new Promise((t) => setTimeout(t, 500));
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
    };

    const handleExport = async (setlist) => {
        setState((prev) => ({
            ...prev,
            chosenSetlist: setlist,
            exportDialogOpen: true
        }));
    };

    const handleCombineSetlists = async () => {
        const seenSongs = new Set<string>();
        const mergedSongs: { artist: string; name: string; tape: boolean }[] = [];
        const setlistArtist = state.predictedSetlists[0].setlistArtist;
        const setlistsArray = state.predictedSetlists as Array<{
            predictedSongs: { artist: string; name: string; tape: boolean }[];
            setlistArtist: any;
        }>;
        const maxLength = Math.max(...state.predictedSetlists.map((s) => s.predictedSongs.length));
        for (let i = 0; i < maxLength; i++) {
            for (const setlist of setlistsArray) {
                if (i < setlist.predictedSongs.length) {
                    const song = setlist.predictedSongs[i];
                    if (!seenSongs.has(song.name)) {
                        seenSongs.add(song.name);
                        mergedSongs.push(song);
                    }
                }
            }
        }
        handleExport({
            predictedSongs: mergedSongs,
            setlistArtist
        });
    };

    return {
        handleCombineSetlists,
        handleExport,
        handleSearch,
        mounted,
        setState,
        state
    };
}
