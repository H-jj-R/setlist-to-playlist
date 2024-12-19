import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { PageState } from "../constants/generateSetlistPageState";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on setlist-search page.
 */
export default function generateSetlistHook() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const { t: i18nErrors } = useTranslation("errors");
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        searchBarLocked: true,
        showAuthDialog: false,
        searchTriggered: false,
        searchComplete: false,
        allSetlistsData: [] as any,
        predictedSetlists: null as any,
        exportDialogOpen: false,
        animLoading: true,
        showLoading: false,
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
            error: null,
            pageState: PageState.Idle
        }));

        if (state.animLoading) {
            setTimeout(() => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }

        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            // TODO: FINISH THIS
            const response = await fetch(`/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`);
            if (!response.ok) {
                const errorResponse = await response.json();
                throw {
                    status: response.status,
                    error: errorResponse.error || "Unknown error"
                };
            }
            const setlistData = await response.json();

            setState((prev) => ({
                ...prev,
                allSetlistsData: setlistData
            }));

            const apiResponse = await fetch("/api/openai/predict-setlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pastSetlists: "PASTSETLISTS" })
            });

            if (!apiResponse.ok) {
                const errorResponse = await apiResponse.json();
                throw {
                    status: apiResponse.status,
                    error: errorResponse.error || "Unknown error"
                };
            }

            const apiData = await apiResponse.json();
            setState((prev) => ({
                ...prev,
                predictedSetlists: apiData.predictedSetlists,
                searchComplete: true,
                showLoading: false,
                pageState: PageState.Setlist
            }));
            console.log(apiData);
        } catch (error) {
            console.error("Error during search:", error);
            setState((prev) => ({
                ...prev,
                showLoading: false,
                error: `${error.status}: ${i18nErrors(error.error)}`
            }));
        }
    };

    const handleExport = async () => {
        // TODO: This.
    };

    const handleExportDialogClosed = () => {
        setState((prev) => ({ ...prev, exportDialogOpen: false }));
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
