import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { PageState } from "@constants/generateSetlistPageState";

/**
 * Hook for data handling on the setlist-search page.
 */
export default function generateSetlistHook() {
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        showAuthDialog: false,
        searchTriggered: false,
        searchComplete: false,
        previousQuery: null as string | null,
        allSetlistsData: [] as Record<string, any>,
        predictedSetlists: null as Record<string, any> | null,
        chosenSetlist: null as Record<string, any> | null,
        exportDialogOpen: false,
        animLoading: true,
        showLoading: false,
        progress: 0,
        error: null as string | null,
        pageState: PageState.Idle
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
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) {
            if (response.status === 401) {
                setState((prev) => ({ ...prev, showAuthDialog: true }));
                return;
            }
        }

        setState((prev) => ({
            ...prev,
            searchTriggered: true,
            searchComplete: false,
            showLoading: false,
            progress: 0,
            error: null,
            pageState: PageState.Idle
        }));

        if (state.animLoading) {
            setTimeout(() => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }

        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            setState((prev) => ({ ...prev, progress: 0 }));
            await new Promise((t) => setTimeout(t, 500));
            const queryLimitResponse = await fetch(`/api/database/check-query-limit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`
                }
            });
            if (!queryLimitResponse.ok) {
                const errorResponse = await queryLimitResponse.json();
                throw {
                    status: queryLimitResponse.status,
                    error: i18n(errorResponse.error) || i18n("common:unexpectedError")
                };
            }
            setState((prev) => ({ ...prev, progress: 10 }));

            const setlistResponse = await fetch(
                `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
            );
            if (!setlistResponse.ok) {
                const errorResponse = await setlistResponse.json();
                throw {
                    status: setlistResponse.status,
                    error: i18n(errorResponse.error) || i18n("common:unexpectedError")
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`
                },
                body: JSON.stringify({ pastSetlists: setlistData.setlists.setlist })
            });

            if (!openAIResponse.ok) {
                const errorResponse = await openAIResponse.json();
                throw {
                    status: openAIResponse.status,
                    error: i18n(errorResponse.error) || i18n("common:unexpectedError")
                };
            }

            const openAIData = await openAIResponse.json();
            clearInterval(interval);
            setState((prev) => ({ ...prev, progress: 100 }));
            await new Promise((t) => setTimeout(t, 500));
            setState((prev) => ({
                ...prev,
                predictedSetlists: Object.values(openAIData.predictedSetlists).map(
                    (predictedSetlist: Record<string, any>) => ({
                        ...predictedSetlist,
                        setlistArtist: setlistData.spotifyArtist
                    })
                ),
                searchComplete: true,
                pageState: PageState.Setlist
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: error.error
            }));
        } finally {
            setState((prev) => ({
                ...prev,
                showLoading: false,
                progress: 0
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
        const mergedSongs: { name: string; artist: string; tape: boolean }[] = [];
        const setlistArtist = state.predictedSetlists[0].setlistArtist;
        const setlistsArray = state.predictedSetlists as Array<{
            predictedSongs: { name: string; artist: string; tape: boolean }[];
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
        mounted,
        state,
        setState,
        handleSearch,
        handleExport,
        handleCombineSetlists
    };
}
