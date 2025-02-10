/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SettingsKeys from "@constants/settingsKeys";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the user-playlist page.
 */
export default function setlistSongsExportHook(
    artistData: Record<string, any>,
    onSongsFetched: (songs: Record<string, any>[]) => void,
    setlist: Record<string, any>,
    predictedSetlist?: boolean
) {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        error: null as null | string,
        excludeCovers: localStorage?.getItem(SettingsKeys.ExcludeCovers) === "true",
        excludedSongs: new Set() as Set<string>,
        excludeDuplicateSongs: localStorage?.getItem(SettingsKeys.ExcludeDuplicateSongs) === "true",
        excludePlayedOnTape: localStorage?.getItem(SettingsKeys.ExcludePlayedOnTape) === "true",
        hideSongsNotFound: localStorage?.getItem(SettingsKeys.HideSongsNotFound) === "true",
        loading: false,
        spotifySongs: null as null | Record<string, any>[]
    });

    useEffect((): (() => void) => {
        const settingsKeys: SettingsKeys[] = [
            SettingsKeys.HideSongsNotFound,
            SettingsKeys.ExcludeCovers,
            SettingsKeys.ExcludeDuplicateSongs,
            SettingsKeys.ExcludePlayedOnTape
        ];
        const handleSettingChange = (key: string): void => {
            setState((prev) => ({ ...prev, [key]: localStorage?.getItem(key) === "true" }));
        };
        settingsKeys.forEach((key): void => {
            window.addEventListener(key, () => handleSettingChange(key));
        });
        return (): void => {
            settingsKeys.forEach((key): void => {
                window.removeEventListener(key, () => handleSettingChange(key));
            });
        };
    }, []);

    useEffect((): void => {
        (async (): Promise<void> => {
            setState((prev) => ({ ...prev, error: null, loading: true }));
            try {
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

                // Songs to exclude automatically based on settings
                const excludedSongs: { idx: number; songId: string }[] = [];
                if (state.excludeCovers) {
                    responseJson.forEach((song: Record<string, any>, idx: number): void => {
                        if (song.artists?.[0]?.name !== artistData.spotifyArtist.name) {
                            excludedSongs.push({ idx: idx, songId: song.id });
                        }
                    });
                }
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
                if (state.excludePlayedOnTape) {
                    setlist.sets.set
                        .flatMap((set: Record<string, any>) =>
                            set.song.filter((song: Record<string, any>) => song.name)
                        )
                        .forEach((song: Record<string, any>, idx: number) => {
                            if (song.tape) {
                                if (responseJson[idx]) {
                                    excludedSongs.push({ idx: idx, songId: responseJson[idx].id });
                                }
                            }
                        });
                }

                // Exclude each song only once
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

    useEffect((): void => {
        if (state.spotifySongs) {
            onSongsFetched(
                state.spotifySongs.filter(
                    (song: Record<string, any>, idx: number) => !state.excludedSongs.has(`${song.id}-${idx}`)
                )
            );
        }
    }, [state.spotifySongs, state.excludedSongs]);

    const toggleExcludeSong = useCallback((songId: string, songIndex: number): void => {
        setState((prev) => ({
            ...prev,
            excludedSongs: ((): Set<string> => {
                const newExcludedSongs = new Set(prev.excludedSongs);
                const songKey = `${songId}-${songIndex}`;

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
