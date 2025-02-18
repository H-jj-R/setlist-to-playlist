/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SettingsKeys from "@constants/settingsKeys";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **listOfSetlistsHook**
 *
 * Custom hook for handling data and state management in the `ListOfSetlists` component.
 *
 * @returns Hook state and handlers.
 */
export default function listOfSetlistsHook(setlistData: Record<string, any>) {
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        currentPage: ((setlistData.setlists.page as number) || 1) as number, // Track the current page of setlists
        error: null as null | string, // Stores error messages
        hiddenSetlistsCount: 0, // Number of hidden setlists (if filtering is enabled)
        hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true", // User preference for hiding empty setlists
        isLoading: false, // Loading indicator for fetching more setlists
        loadedSetlists: (setlistData.setlists.setlist || []) as [] | Record<string, any>[], // Stores all loaded setlists
        setlists: (setlistData.setlists.setlist || []) as [] | Record<string, any>[] // Stores visible setlists (after filtering)
    });

    /**
     * Listens for changes to the localStorage setting for hiding empty setlists.
     * Updates the state accordingly when the setting is changed externally.
     */
    useEffect((): (() => void) => {
        const handleStorageChange = (): void => {
            setState((prev) => ({
                ...prev,
                hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true"
            }));
        };

        // Listen for changes to the HideEmptySetlists setting
        window.addEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);

        // Cleanup listener when the component unmounts
        return (): void => {
            window.removeEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);
        };
    }, []);

    /**
     * Updates the visible setlists whenever the hideEmptySetlists setting changes.
     * Filters out empty setlists if the option is enabled.
     */
    useEffect((): void => {
        const filteredSetlists = state.hideEmptySetlists
            ? filterEmptySetlists(state.loadedSetlists)
            : state.loadedSetlists;
        setState((prev) => ({
            ...prev,
            hiddenSetlistsCount: state.loadedSetlists.length - filteredSetlists.length,
            setlists: filteredSetlists
        }));
    }, [state.hideEmptySetlists, state.loadedSetlists]);

    /**
     * Filters out setlists that don't contain any songs.
     * @param setlistData - The list of setlists to filter.
     * @returns A filtered list containing only setlists with songs.
     */
    const filterEmptySetlists = (setlistData: Record<string, any>[]): Record<string, any>[] => {
        return setlistData.filter((setlist: Record<string, any>): boolean => {
            // Count the total number of songs across all sets
            const songCount = setlist.sets.set.reduce(
                (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
                0
            );
            return songCount > 0; // Keep only setlists with at least one song
        });
    };

    /**
     * Determines whether there are more pages of setlists to load.
     */
    const hasMorePages: boolean = useMemo((): boolean => {
        return state.currentPage < Math.ceil(setlistData.setlists.total / setlistData.setlists.itemsPerPage);
    }, [state.currentPage, setlistData.setlists.total, setlistData.setlists.itemsPerPage]);

    /**
     * Loads additional setlists by fetching data from the setlist.fm API.
     * Updates the state with the newly loaded setlists.
     */
    const loadMoreSetlists = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            // Fetch the next page of setlists from the API
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

            // Append new setlists to the existing ones
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
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, [state.currentPage, setlistData.setlistfmArtist.mbid]);

    return { hasMorePages, loadMoreSetlists, state };
}
