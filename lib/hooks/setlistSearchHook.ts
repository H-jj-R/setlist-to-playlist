import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { PageState } from "../constants/setlistSearchPageState";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on setlist-search page.
 */
export default function setlistSearchHook() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const { t: i18nErrors } = useTranslation("errors");
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        searchTriggered: false,
        searchComplete: false,
        lastQuery: null as string | null,
        allSetlistsData: [] as any,
        setlistChosen: false,
        chosenSetlistData: null as any,
        exportDialogOpen: false,
        animLoading: true,
        showLoading: false,
        error: null as string | null,
        pageState: PageState.Idle
    });

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    useEffect(() => {
        const { q, setlist } = router.query;

        if (q && !setlist) {
            if (state.pageState !== PageState.LosSetlist || q !== state.lastQuery) {
                handleSearch(q as string, null);
            }
        } else if (setlist && !q) {
            handleSearch(null, setlist as string);
        } else if (setlist && q) {
            if (!state.searchComplete) {
                handleSearch(q as string, setlist as string);
            } else {
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    pageState: PageState.LosSetlist
                }));
            }
        } else {
            setState((prev) => ({
                ...prev,
                searchTriggered: false,
                animLoading: true,
                pageState: PageState.Idle
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
            throw {
                status: response.status,
                error: errorResponse.error || "Unknown error"
            };
        }
        return await response.json();
    };

    const handleSearch = async (query: string | null, setlist: string | null) => {
        setState((prev) => ({
            ...prev,
            searchTriggered: true,
            searchComplete: false,
            setlistChosen: false,
            chosenSetlistData: null,
            showLoading: false,
            error: null
        }));

        if (state.animLoading) {
            setTimeout(() => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }

        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            if (query && !setlist) {
                const data = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    searchComplete: true,
                    allSetlistsData: data,
                    showLoading: false,
                    pageState: PageState.ListOfSetlists
                }));
            } else if (!query && setlist) {
                const setlistData = await fetchData(
                    `/api/setlist-fm/setlist-setlistid?${new URLSearchParams({ setlistId: setlist }).toString()}`
                );
                const artistData = await fetchData(
                    `/api/spotify/search-artist?${new URLSearchParams({ query: setlistData.artist.name }).toString()}`
                );
                const fullArtistdetails = { setlistfmArtist: setlistData.artist, spotifyArtist: artistData };
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    allSetlistsData: fullArtistdetails,
                    chosenSetlistData: setlistData,
                    showLoading: false,
                    pageState: PageState.Setlist
                }));
            } else if (query && setlist) {
                const queryData = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    showLoading: false,
                    searchComplete: true,
                    allSetlistsData: queryData
                }));
                const setlistData = await fetchData(
                    `/api/setlist-fm/setlist-setlistid?${new URLSearchParams({ setlistId: setlist }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    setlistChosen: true,
                    chosenSetlistData: setlistData,
                    pageState: PageState.LosSetlist
                }));
            }
        } catch (error) {
            console.error("Error during search:", error);
            setState((prev) => ({
                ...prev,
                showLoading: false,
                error: `${i18nErrors(error.error)}`
            }));
        }
    };

    const handleSearchRouterPush = async (query: string) => {
        if (!query) return;

        const queryParams = query.startsWith("https://www.setlist.fm/setlist/")
            ? { setlist: query.split("-").pop()?.replace(".html", "") }
            : { q: query };

        await router.push(
            {
                pathname: "/setlist-search",
                query: queryParams
            },
            undefined,
            { shallow: true }
        );
    };

    const handleSetlistChosenRouterPush = async (setlist: any) => {
        setState((prev) => ({ ...prev, chosenSetlistData: setlist }));
        await router.push(
            {
                pathname: "/setlist-search",
                query: { q: router.query.q, setlist: setlist.id }
            },
            undefined,
            { shallow: true }
        );
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
            pageState: PageState.ListOfSetlists
        }));
    };

    const handleExport = async () => {
        try {
            const response = await fetch("/api/controllers/check-for-authentication", {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 200) {
                setState((prev) => ({ ...prev, exportDialogOpen: true }));
            } else if (response.status === 401) {
                router.push(
                    `/api/spotify/authorise?${new URLSearchParams({
                        redirect: window.location.pathname + window.location.search
                    }).toString()}`
                );
            }
        } catch (error) {
            console.error("Error checking authorisation:", error);
        }
    };

    const handleExportDialogClosed = () => {
        setState((prev) => ({ ...prev, exportDialogOpen: false }));
    };

    return {
        mounted,
        state,
        handleSearchRouterPush,
        handleSetlistChosenRouterPush,
        handleBackToList,
        handleExport,
        handleExportDialogClosed
    };
}
