/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SettingsKeys from "@constants/settingsKeys";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the ListOfSetlists component.
 */
export default function listOfSetlistsHook(setlistData: Record<string, any>) {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        currentPage: ((setlistData.setlists.page as number) || 1) as number,
        hiddenSetlistsCount: 0,
        hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true",
        isLoading: false,
        loadedSetlists: (setlistData.setlists.setlist || []) as [] | Record<string, any>[],
        setlists: (setlistData.setlists.setlist || []) as [] | Record<string, any>[]
    });

    // Update setlists
    useEffect(() => {
        const filteredSetlists = state.hideEmptySetlists
            ? filterEmptySetlists(state.loadedSetlists)
            : state.loadedSetlists;
        setState((prev) => ({
            ...prev,
            hiddenSetlistsCount: state.loadedSetlists.length - filteredSetlists.length,
            setlists: filteredSetlists
        }));
    }, [state.hideEmptySetlists, state.loadedSetlists]);

    useEffect(() => {
        const handleStorageChange = () => {
            setState((prev) => ({
                ...prev,
                hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true"
            }));
        };

        window.addEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);
        return () => {
            window.removeEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);
        };
    }, []);

    const filterEmptySetlists = (data: Record<string, any>[]) => {
        return data.filter((setlist: Record<string, any>) => {
            const songCount = setlist.sets.set.reduce(
                (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
                0
            );
            return songCount > 0;
        });
    };

    const hasMorePages = state.currentPage < Math.ceil(setlistData.setlists.total / setlistData.setlists.itemsPerPage);

    const loadMoreSetlists = async () => {
        setState((prev) => ({
            ...prev,
            isLoading: true
        }));
        try {
            const response = await fetch(
                `/api/setlist-fm/search-setlists?${new URLSearchParams({
                    artistMbid: setlistData.setlistfmArtist.mbid,
                    page: (state.currentPage + 1).toString()
                }).toString()}`
            );
            const responseJson = await response.json();
            if (!response.ok) {
                throw {
                    error: i18n(responseJson.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            const newData = responseJson;
            const newSetlists = newData.setlist || [];
            setState((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1,
                loadedSetlists: [...prev.loadedSetlists, ...newSetlists] as Record<string, any>[]
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setState((prev) => ({
                ...prev,
                isLoading: false
            }));
        }
    };

    return { hasMorePages, loadMoreSetlists, state };
}
