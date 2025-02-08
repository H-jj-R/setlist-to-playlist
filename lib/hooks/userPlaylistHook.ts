/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { MessageDialogState } from "@constants/messageDialogState";

/**
 * Hook for data handling on the user-playlist page.
 */
export default function userPlaylistHook(playlist: any, onDelete: (playlistId: number) => void) {
    const { t: i18n } = useTranslation();
    const router = useRouter();
    const [state, setState] = useState({
        expanded: false,
        editing: false,
        name: playlist.name as string,
        description: (playlist.description || "") as string,
        initialName: playlist.name as string,
        initialDescription: (playlist.description || "") as string,
        tracks: null as Record<string, any> | null,
        songsLoading: false,
        songError: null as string | null,
        showConfirmation: false,
        showAuthDialog: false,
        messageDialog: {
            isOpen: false,
            message: "",
            type: MessageDialogState.Success,
            onClose: null as (() => void) | null
        }
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
            songsLoading: true,
            songError: null
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
                    status: response.status,
                    error: i18n(data.error) || i18n("common:unexpectedError")
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
            messageDialog: { isOpen: true, message: "", type: MessageDialogState.Loading, onClose: null }
        }));

        try {
            if (!state.name.trim()) {
                throw {
                    status: 400,
                    error: i18n("exportSetlist:noNameProvided")
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
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ playlistName: state.name, playlistDescription: state.description })
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(data.error) || i18n("common:unexpectedError")
                };
            }

            setState((prev) => ({
                ...prev,
                initialName: state.name,
                initialDescription: state.description,
                editing: false,
                messageDialog: {
                    isOpen: true,
                    message: i18n("userPlaylists:detailsUpdated"),
                    type: MessageDialogState.Success,
                    onClose: null
                }
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, type: MessageDialogState.Error, onClose: null }
            }));
        }
    };

    const handleRecover = async () => {
        try {
            const response = await fetch("/api/controllers/check-for-authentication", {
                method: "GET",
                credentials: "include"
            });
            if (response.status === 401) {
                setState((prev) => ({ ...prev, showAuthDialog: true }));
            } else if (response.status === 200) {
                setState((prev) => ({
                    ...prev,
                    messageDialog: { isOpen: true, message: "", type: MessageDialogState.Loading, onClose: null }
                }));
                const response = await fetch(`/api/controllers/create-spotify-playlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage?.getItem("authToken")}`
                    },
                    body: JSON.stringify({
                        name: state.name,
                        description: state.description,
                        tracks: JSON.stringify(state.tracks ? state.tracks : await fetchTrackDetails())
                    })
                });
                const responseJson = await response.json();
                if (!response.ok) {
                    throw {
                        status: response.status,
                        error: i18n(responseJson.error) || i18n("common:unexpectedError")
                    };
                }
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("userPlaylists:playlistRecovered"),
                        type: MessageDialogState.Success,
                        onClose: null
                    }
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, type: MessageDialogState.Error, onClose: null }
            }));
        }
    };

    const handleDelete = async () => {
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", type: MessageDialogState.Loading, onClose: null }
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
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(data.error) || i18n("common:unexpectedError")
                };
            }

            setState((prev) => ({
                ...prev,
                showConfirmation: false,
                messageDialog: {
                    isOpen: true,
                    message: i18n("userPlaylists:playlistDeleted"),
                    type: MessageDialogState.Success,
                    onClose: () => {
                        setState((prev) => ({
                            ...prev,
                            messageDialog: {
                                isOpen: false,
                                message: "",
                                type: MessageDialogState.Success,
                                onClose: null
                            }
                        }));
                        onDelete(playlist.playlistId);
                    }
                }
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: { isOpen: true, message: error.error, type: MessageDialogState.Error, onClose: null }
            }));
        }
    };

    return {
        state,
        setState,
        toggleExpand,
        handleSave,
        handleRecover,
        handleDelete
    };
}
