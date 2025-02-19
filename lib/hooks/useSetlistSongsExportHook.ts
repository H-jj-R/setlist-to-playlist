/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SettingsKeys from "@constants/settingsKeys";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **useSetlistSongsExportHook**
 *
 * Custom hook for handling data and state management in the `SetlistSongsExport` component.
 *
 * @param {Record<string, any>} artistData - The artist data object.
 * @param {Function} onSongsFetched - Callback to handle fetched songs.
 * @param {Record<string, any>} setlist - The setlist data object.
 * @param {boolean} [predictedSetlist] - Optional flag indicating if the setlist is predicted.
 *
 * @returns Hook state and handlers.
 */
export default function useSetlistSongsExportHook(
    artistData: Record<string, any>,
    onSongsFetched: (songs: Record<string, any>[]) => void,
    setlist: Record<string, any>,
    predictedSetlist?: boolean
) {
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        error: null as null | string, // Stores error messages
        excludeCovers: localStorage?.getItem(SettingsKeys.ExcludeCovers) === "true", // Exclude cover songs setting
        excludedSongs: new Set() as Set<string>, // Tracks excluded songs
        excludeDuplicateSongs: localStorage?.getItem(SettingsKeys.ExcludeDuplicateSongs) === "true", // Exclude duplicate songs setting
        excludePlayedOnTape: localStorage?.getItem(SettingsKeys.ExcludePlayedOnTape) === "true", // Exclude songs played on tape setting
        hideSongsNotFound: localStorage?.getItem(SettingsKeys.HideSongsNotFound) === "true", // Hide songs not found setting
        loading: false, // Tracks loading state
        spotifySongs: null as null | Record<string, any>[] // Stores fetched Spotify songs
    });

    /**
     * Effect hook to listen for changes in local storage and update settings accordingly.
     */
    useEffect((): (() => void) => {
        // Settings keys to listen for
        const settingsKeys: SettingsKeys[] = [
            SettingsKeys.HideSongsNotFound,
            SettingsKeys.ExcludeCovers,
            SettingsKeys.ExcludeDuplicateSongs,
            SettingsKeys.ExcludePlayedOnTape
        ];
        const handleSettingChange = (key: string): void => {
            setState((prev) => ({ ...prev, [key]: localStorage?.getItem(key) === "true" }));
        };

        // Add event listeners for each settings key
        settingsKeys.forEach((key): void => {
            window.addEventListener(key, () => handleSettingChange(key));
        });

        // Cleanup all listeners when the component unmounts
        return (): void => {
            settingsKeys.forEach((key): void => {
                window.removeEventListener(key, (): void => handleSettingChange(key));
            });
        };
    }, []);

    /**
     * Effect hook to fetch Spotify songs based on the setlist and artist data.
     */
    useEffect((): void => {
        (async (): Promise<void> => {
            setState((prev) => ({ ...prev, error: null, loading: true }));
            try {
                // Make an API request to fetch Spotify songs
                const response = await fetch(
                    `/api/controllers/get-spotify-songs?${new URLSearchParams({
                        artist: artistData.spotifyArtist.name,
                        isPredicted: predictedSetlist ? "true" : "false"
                    }).toString()}`,
                    {
                        body: JSON.stringify({ setlist }),
                        headers: { "Content-Type": "application/json" },
                        method: "POST"
                    }
                );
                const responseJson = await response.json();
                if (!response.ok) {
                    throw {
                        error: i18n(responseJson.error) || i18n("common:unexpectedError"),
                        status: response.status
                    };
                }
                setState((prev) => ({ ...prev, spotifySongs: responseJson }));

                // Initialise array to store songs that need to be excluded based on settings
                const excludedSongs: { idx: number; songId: string }[] = [];

                // Exclude cover songs
                if (state.excludeCovers) {
                    responseJson.forEach((song: Record<string, any>, idx: number): void => {
                        if (song.artists?.[0]?.name !== artistData.spotifyArtist.name) {
                            excludedSongs.push({ idx: idx, songId: song.id });
                        }
                    });
                }

                // Exclude duplicate songs
                if (state.excludeDuplicateSongs) {
                    const duplicateSongs = new Set();
                    responseJson.forEach((song: Record<string, any>, idx: number): void => {
                        if (duplicateSongs.has(song.id)) {
                            excludedSongs.push({ idx: idx, songId: song.id });
                        } else {
                            duplicateSongs.add(song.id);
                        }
                    });
                }

                // Exclude songs that were played on tape
                if (state.excludePlayedOnTape) {
                    setlist.sets.set
                        .flatMap((set: Record<string, any>) =>
                            set.song.filter((song: Record<string, any>) => song.name)
                        )
                        .forEach((song: Record<string, any>, idx: number): void => {
                            if (song.tape) {
                                if (responseJson[idx]) {
                                    excludedSongs.push({ idx: idx, songId: responseJson[idx].id });
                                }
                            }
                        });
                }

                // Ensure that each song is excluded only once
                const processedSongs = new Set<string>();
                excludedSongs.forEach(({ idx, songId }): void => {
                    const uniqueKey = `${songId}-${idx}`;
                    if (!processedSongs.has(uniqueKey)) {
                        toggleExcludeSong(songId, idx);
                        processedSongs.add(uniqueKey);
                    }
                });
            } catch (error) {
                setState((prev) => ({ ...prev, error: error.error }));
            } finally {
                setState((prev) => ({ ...prev, loading: false }));
            }
        })();
    }, [setlist, artistData.spotifyArtist.name]);

    /**
     * Effect hook to update the fetched songs when the Spotify songs or excluded songs state changes.
     */
    useEffect((): void => {
        if (state.spotifySongs) {
            onSongsFetched(
                state.spotifySongs.filter(
                    (song: Record<string, any>, idx: number) => !state.excludedSongs.has(`${song.id}-${idx}`)
                )
            );
        }
    }, [state.spotifySongs, state.excludedSongs]);

    /**
     * Toggles the exclusion of a song by its ID and index.
     *
     * @param {string} songId The ID of the song to toggle.
     * @param {number} songIdx The index of the song to toggle.
     */
    const toggleExcludeSong = useCallback((songId: string, songIdx: number): void => {
        setState((prev) => ({
            ...prev,
            excludedSongs: ((): Set<string> => {
                // Create a new Set based on the previous excluded songs
                const newExcludedSongs = new Set(prev.excludedSongs);
                const songKey = `${songId}-${songIdx}`;

                // Toggle the song's exclusion status
                if (newExcludedSongs.has(songKey)) {
                    newExcludedSongs.delete(songKey);
                } else {
                    newExcludedSongs.add(songKey);
                }

                return newExcludedSongs;
            })()
        }));
    }, []);

    return { state, toggleExcludeSong };
}
