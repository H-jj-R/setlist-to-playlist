/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialogState from "@constants/messageDialogState";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the user-playlist page.
 */
export default function userPlaylistHook(onDelete: (playlistId: number) => void, playlist: any) {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        description: (playlist.description || "") as string,
        editing: false,
        expanded: false,
        initialDescription: (playlist.description || "") as string,
        initialName: playlist.name as string,
        messageDialog: {
            isOpen: false,
            message: "",
            onClose: null as (() => void) | null,
            type: MessageDialogState.Success
        },
        name: playlist.name as string,
        showAuthDialog: false,
        showConfirmation: false,
        songError: null as null | string,
        songsLoading: false,
        tracks: null as null | Record<string, any>
    });

    const toggleExpand = async () => {
        setState((prev) => ({
            ...prev,
            expanded: !state.expanded
        }));
        if (!state.tracks && !state.songsLoading) {
            const trackDetails = await fetchTrackDetails();
            setState((prev) => ({
                ...prev,
                tracks: trackDetails
            }));
        }
    };

    const fetchTrackDetails = async () => {
        setState((prev) => ({
            ...prev,
            songError: null,
            songsLoading: true
        }));

        try {
            const trackIds = playlist.tracks.map((track: any) => track.songID).join(",");
            const response = await fetch(
                `/api/spotify/get-tracks?${new URLSearchParams({
                    query: trackIds
                }).toString()}`
            );
            const data = await response.json();
            if (!response.ok) {
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            return data.tracks;
        } catch (error) {
            setState((prev) => ({
                ...prev,
                songError: error.error
            }));
        } finally {
            setState((prev) => ({
                ...prev,
                songsLoading: false
            }));
        }
    };

    const handleSave = async () => {
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
        }));

        try {
            if (!state.name.trim()) {
                throw {
                    error: i18n("exportSetlist:noNameProvided"),
                    status: 400
                };
            }

            const token = localStorage?.getItem("authToken");
            if (!token) {
                return;
            }

            const response = await fetch(
                `/api/database/update-playlist-details?${new URLSearchParams({
                    playlistId: playlist.playlistId
                }).toString()}`,
                {
                    body: JSON.stringify({ playlistDescription: state.description, playlistName: state.name }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            setState((prev) => ({
                ...prev,
                editing: false,
                initialDescription: state.description,
                initialName: state.name,
                messageDialog: {
                    isOpen: true,
                    message: i18n("userPlaylists:detailsUpdated"),
                    onClose: null,
                    type: MessageDialogState.Success
                }
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, onClose: null, type: MessageDialogState.Error }
            }));
        }
    };

    const handleRecover = async () => {
        try {
            const response = await fetch("/api/controllers/check-for-authentication", {
                credentials: "include",
                method: "GET"
            });
            if (response.status === 401) {
                setState((prev) => ({ ...prev, showAuthDialog: true }));
            } else if (response.status === 200) {
                setState((prev) => ({
                    ...prev,
                    messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
                }));
                const response = await fetch(`/api/controllers/create-spotify-playlist`, {
                    body: JSON.stringify({
                        description: state.description,
                        name: state.name,
                        tracks: JSON.stringify(state.tracks ? state.tracks : await fetchTrackDetails())
                    }),
                    headers: {
                        Authorization: `Bearer ${localStorage?.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    },
                    method: "POST"
                });
                const responseJson = await response.json();
                if (!response.ok) {
                    throw {
                        error: i18n(responseJson.error) || i18n("common:unexpectedError"),
                        status: response.status
                    };
                }
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("userPlaylists:playlistRecovered"),
                        onClose: null,
                        type: MessageDialogState.Success
                    }
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, onClose: null, type: MessageDialogState.Error }
            }));
        }
    };

    const handleDelete = async () => {
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
        }));

        try {
            const token = localStorage?.getItem("authToken");
            if (!token) {
                return;
            }

            const response = await fetch(
                `/api/database/delete-user-playlist?${new URLSearchParams({
                    playlistId: playlist.playlistId
                }).toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    method: "POST"
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("userPlaylists:playlistDeleted"),
                    onClose: () => {
                        setState((prev) => ({
                            ...prev,
                            messageDialog: {
                                isOpen: false,
                                message: "",
                                onClose: null,
                                type: MessageDialogState.Success
                            }
                        }));
                        onDelete(playlist.playlistId);
                    },
                    type: MessageDialogState.Success
                },
                showConfirmation: false
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, onClose: null, type: MessageDialogState.Error }
            }));
        }
    };

    return {
        handleDelete,
        handleRecover,
        handleSave,
        setState,
        state,
        toggleExpand
    };
}
