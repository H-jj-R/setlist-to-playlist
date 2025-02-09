/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SettingsKeys from "@constants/settingsKeys";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the user-playlist page.
 */
export default function setlistSongsExportHook(
    setlist: Record<string, any>,
    artistData: Record<string, any>,
    onSongsFetched: (songs: Record<string, any>[]) => void,
    predictedSetlist?: boolean
) {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        spotifySongs: null as Record<string, any>[] | null,
        loading: false,
        error: null as string | null,
        excludedSongs: new Set() as Set<string>,
        hideSongsNotFound: localStorage?.getItem(SettingsKeys.HideSongsNotFound) === "true",
        excludeCovers: localStorage?.getItem(SettingsKeys.ExcludeCovers) === "true",
        excludeDuplicateSongs: localStorage?.getItem(SettingsKeys.ExcludeDuplicateSongs) === "true",
        excludePlayedOnTape: localStorage?.getItem(SettingsKeys.ExcludePlayedOnTape) === "true"
    });

    useEffect(() => {
        const settingsKeys = [
            SettingsKeys.HideSongsNotFound,
            SettingsKeys.ExcludeCovers,
            SettingsKeys.ExcludeDuplicateSongs,
            SettingsKeys.ExcludePlayedOnTape
        ];
        const handleSettingChange = (key: string) => {
            setState((prev) => ({
                ...prev,
                [key]: localStorage?.getItem(key) === "true"
            }));
        };
        settingsKeys.forEach((key) => {
            window.addEventListener(key, () => handleSettingChange(key));
        });
        return () => {
            settingsKeys.forEach((key) => {
                window.removeEventListener(key, () => handleSettingChange(key));
            });
        };
    }, []);

    useEffect(() => {
        (async () => {
            setState((prev) => ({
                ...prev,
                loading: true,
                error: null
            }));
            try {
                const response = await fetch(
                    `/api/controllers/get-spotify-songs?${new URLSearchParams({
                        artist: artistData.spotifyArtist.name,
                        isPredicted: predictedSetlist ? "true" : "false"
                    }).toString()}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ setlist })
                    }
                );
                const responseJson = await response.json();
                if (!response.ok) {
                    throw {
                        status: response.status,
                        error: i18n(responseJson.error) || i18n("common:unexpectedError")
                    };
                }
                setState((prev) => ({
                    ...prev,
                    spotifySongs: responseJson
                }));

                // Songs to exclude automatically based on settings
                const excludedSongs: { songId: string; idx: number }[] = [];
                if (state.excludeCovers) {
                    responseJson.forEach((song: any, idx: number) => {
                        if (song.artists?.[0]?.name !== artistData.spotifyArtist.name) {
                            excludedSongs.push({ songId: song.id, idx: idx });
                        }
                    });
                }
                if (state.excludeDuplicateSongs) {
                    const duplicateSongs = new Set();
                    responseJson.forEach((song: any, idx: number) => {
                        if (duplicateSongs.has(song.id)) {
                            excludedSongs.push({ songId: song.id, idx: idx });
                        } else {
                            duplicateSongs.add(song.id);
                        }
                    });
                }
                if (state.excludePlayedOnTape) {
                    setlist.sets.set
                        .flatMap((set) => set.song.filter((song) => song.name))
                        .forEach((song, idx) => {
                            if (song.tape) {
                                if (responseJson[idx]) {
                                    excludedSongs.push({ songId: responseJson[idx].id, idx: idx });
                                }
                            }
                        });
                }

                // Exclude each song only once
                const processedSongs = new Set<string>();
                excludedSongs.forEach(({ songId, idx }) => {
                    const uniqueKey = `${songId}-${idx}`;
                    if (!processedSongs.has(uniqueKey)) {
                        toggleExcludeSong(songId, idx);
                        processedSongs.add(uniqueKey);
                    }
                });
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    error: error.error
                }));
            } finally {
                setState((prev) => ({
                    ...prev,
                    loading: false
                }));
            }
        })();
    }, [setlist, artistData.spotifyArtist.name]);

    useEffect(() => {
        if (state.spotifySongs) {
            onSongsFetched(state.spotifySongs.filter((song, idx) => !state.excludedSongs.has(`${song.id}-${idx}`)));
        }
    }, [state.spotifySongs, state.excludedSongs]);

    const toggleExcludeSong = (songId: string, songIndex: number) => {
        setState((prev) => ({
            ...prev,
            excludedSongs: (() => {
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
    };

    return { state, toggleExcludeSong };
}
