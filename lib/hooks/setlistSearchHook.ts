/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import PageState from "@constants/setlistSearchPageState";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the setlist-search page.
 */
export default function setlistSearchHook() {
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        allSetlistsData: [] as Record<string, any>,
        animLoading: true,
        chosenSetlistData: null as null | Record<string, any>,
        error: null as null | string,
        exportDialogOpen: false,
        lastQuery: null as null | string,
        pageState: PageState.Idle,
        searchComplete: false,
        searchTriggered: false,
        setlistChosen: false,
        showAuthDialog: false,
        showLoading: false
    });

    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    useEffect((): void => {
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
                    pageState: PageState.LosSetlist,
                    setlistChosen: true
                }));
            }
        } else {
            setState((prev) => ({
                ...prev,
                animLoading: true,
                pageState: PageState.Idle,
                searchTriggered: false
            }));
        }

        setState((prev) => ({
            ...prev,
            lastQuery: router.query.q as string
        }));
    }, [router.query.q, router.query.setlist]);

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

    const handleSearch = async (query: null | string, setlist: null | string): Promise<void> => {
        setState((prev) => ({
            ...prev,
            chosenSetlistData: null,
            error: null,
            searchComplete: false,
            searchTriggered: true,
            setlistChosen: false,
            showLoading: false
        }));

        if (state.animLoading) {
            setTimeout((): void => setState((prev) => ({ ...prev, animLoading: false })), 750);
        }

        setState((prev) => ({ ...prev, showLoading: true }));

        try {
            if (query && !setlist) {
                const data = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
                );
                setState((prev) => ({
                    ...prev,
                    allSetlistsData: data,
                    pageState: PageState.ListOfSetlists,
                    searchComplete: true,
                    showLoading: false
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
                    allSetlistsData: fullArtistdetails,
                    chosenSetlistData: setlistData,
                    pageState: PageState.Setlist,
                    setlistChosen: true,
                    showLoading: false
                }));
            } else if (query && setlist) {
                const queryData = await fetchData(
                    `/api/controllers/get-setlists?${new URLSearchParams({ query }).toString()}`
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
            setState((prev) => ({
                ...prev,
                error: error.error,
                showLoading: false
            }));
        }
    };

    const handleSearchRouterPush = useCallback(
        async (query: string): Promise<void> => {
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
        },
        [router]
    );

    const handleSetlistChosenRouterPush = useCallback(
        async (setlist: Record<string, any>): Promise<void> => {
            setState((prev) => ({ ...prev, chosenSetlistData: setlist }));
            await router.push(
                {
                    pathname: "/setlist-search",
                    query: { q: router.query.q, setlist: setlist.id }
                },
                undefined,
                { shallow: true }
            );
        },
        [router]
    );

    const handleBackToList = useCallback(async (): Promise<void> => {
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
            chosenSetlistData: null,
            pageState: PageState.ListOfSetlists,
            setlistChosen: false
        }));
    }, [router]);

    const handleExport = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch("/api/controllers/check-for-authentication", {
                credentials: "include",
                method: "GET"
            });

            if (response.status === 200) {
                setState((prev) => ({ ...prev, exportDialogOpen: true }));
            } else if (response.status === 401) {
                setState((prev) => ({ ...prev, showAuthDialog: true }));
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    return {
        handleBackToList,
        handleExport,
        handleSearchRouterPush,
        handleSetlistChosenRouterPush,
        mounted,
        setState,
        state
    };
}
