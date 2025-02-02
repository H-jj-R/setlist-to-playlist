import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { PageState } from "@constants/generateSetlistPageState";

/**
 * Hook for data handling on the setlist-search page.
 */
export default function generateSetlistHook() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        searchBarLocked: true,
        showAuthDialog: false,
        searchTriggered: false,
        searchComplete: false,
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
        const checkAuthentication = async () => {
            const response = await fetch("/api/controllers/check-for-authentication", {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) {
                if (response.status === 401) {
                    setState((prev) => ({ ...prev, searchBarLocked: true, showAuthDialog: true }));
                }
            } else {
                setState((prev) => ({ ...prev, searchBarLocked: false, showAuthDialog: false }));
            }
        };
        checkAuthentication();
    }, [resolvedTheme]);

    const handleAuthoriseSpotify = () => {
        router.push(
            `/api/spotify/authorise?${new URLSearchParams({
                redirect: window.location.pathname + window.location.search
            }).toString()}`
        );
    };

    const handleSearch = async (query: string) => {
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
                    error: i18n(errorResponse.error) || i18n("errors:unexpectedError")
                };
            }
            setState((prev) => ({
                ...prev,
                progress: 10
            }));

            const setlistResponse = await fetch(
                `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
            );
            if (!setlistResponse.ok) {
                const errorResponse = await setlistResponse.json();
                throw {
                    status: setlistResponse.status,
                    error: i18n(errorResponse.error) || i18n("errors:unexpectedError")
                };
            }
            const setlistData = await setlistResponse.json();
            setState((prev) => ({
                ...prev,
                allSetlistsData: setlistData,
                progress: 25
            }));

            // Simulate gradual progress while waiting for AI response
            let simulatedProgress = 25;
            const interval = setInterval(() => {
                simulatedProgress += 5;
                setState((prev) => ({ ...prev, progress: simulatedProgress }));
                if (simulatedProgress >= 95) clearInterval(interval);
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
                    error: i18n(errorResponse.error) || i18n("errors:unexpectedError")
                };
            }

            const openAIData = await openAIResponse.json();
            clearInterval(interval);
            setState((prev) => ({
                ...prev,
                predictedSetlists: openAIData.predictedSetlists.map((predictedSetlist, idx) => ({
                    ...predictedSetlist,
                    setlistArtist: setlistData.spotifyArtist
                })),
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

    const handleExportDialogClosed = () => {
        setState((prev) => ({
            ...prev,
            chosenSetlist: null,
            exportDialogOpen: false
        }));
    };

    return {
        mounted,
        state,
        handleAuthoriseSpotify,
        handleSearch,
        handleExport,
        handleExportDialogClosed
    };
}
