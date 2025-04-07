/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialogState from "@constants/messageDialogState";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **useUserPlaylistHook**
 *
 * Custom hook for handling data and state management in the `UserPlaylist` component.
 *
 * @param {Function} onDelete - Callback to handle playlist deletion.
 * @param {Record<string, any>} playlist - The playlist data object.
 *
 * @returns Hook state and handlers.
 */
export default function useUserPlaylistHook(onDelete: (playlistId: number) => void, playlist: Record<string, any>) {
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        description: (playlist.description || "") as string, // Playlist description
        editing: false, // Tracks if the playlist is being edited
        expanded: false, // Tracks if the playlist details are expanded
        initialDescription: (playlist.description || "") as string, // Initial playlist description
        initialName: playlist.name as string, // Initial playlist name
        messageDialog: {
            isOpen: false,
            message: "",
            onClose: null as (() => void) | null,
            type: MessageDialogState.Success
        },
        name: playlist.name as string, // Playlist name
        showAuthDialog: false, // Controls the visibility of the authentication dialog
        showConfirmation: false, // Controls the visibility of the confirmation dialog
        songError: null as null | string, // Stores error messages related to songs
        songsLoading: false, // Tracks loading state for songs
        tracks: null as null | Record<string, any> // Stores fetched track details
    });

    /**
     * Fetches track details from the Spotify API.
     *
     * @returns {Promise<Record<string, any>>} A promise resolving to the fetched track details.
     */
    const fetchTrackDetails = async (): Promise<Record<string, any>> => {
        setState((prev) => ({ ...prev, songError: null, songsLoading: true }));

        try {
            // Extract track IDs from the playlist and create a comma-separated string (required for Spotify API)
            const trackIds = playlist.tracks.map((track: Record<string, any>) => track.songID).join(",");

            // Make API request to fetch all track details
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

            return data.tracks as Record<string, any>;
        } catch (error) {
            setState((prev) => ({ ...prev, songError: error.error }));
        } finally {
            setState((prev) => ({ ...prev, songsLoading: false }));
        }
    };

    /**
     * Toggles the expansion state of the playlist contents.
     */
    const toggleExpand = useCallback(async (): Promise<void> => {
        setState((prev) => ({ ...prev, expanded: !state.expanded }));

        // Fetch track details if they haven't been loaded yet.
        if (!state.tracks && !state.songsLoading) {
            const trackDetails = await fetchTrackDetails();
            setState((prev) => ({ ...prev, tracks: trackDetails }));
        }
    }, [state.expanded, state.tracks, state.songsLoading]);

    /**
     * Handles saving the playlist details.
     */
    const handleSave = useCallback(async (): Promise<void> => {
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
        }));

        try {
            // Validate playlist name exists
            if (!state.name.trim()) {
                throw {
                    error: i18n("exportSetlist:noNameProvided"),
                    status: 400
                };
            }

            // Retrieve user authentication token
            const token = localStorage?.getItem("authToken");
            if (!token) return;

            // Send an API request to update the playlist details
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
            if (!response.ok) {
                const data = await response.json();
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            // Update state to reflect saved details and show success message
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
    }, [state.name, state.description, state.messageDialog]);

    /**
     * Handles recovering the playlist by recreating it on Spotify.
     */
    const handleRecover = useCallback(async (): Promise<void> => {
        try {
            // Check user authentication status
            const response = await fetch("/api/controllers/check-for-authentication", {
                credentials: "include",
                method: "GET"
            });
            if (response.status === 401 || response.status === 400) {
                // If unauthorised, prompt the user with an authentication dialog
                setState((prev) => ({ ...prev, showAuthDialog: true }));
                return;
            } else if (response.status === 200) {
                setState((prev) => ({
                    ...prev,
                    messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
                }));

                // Send API request to create the playlist on Spotify
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
                if (!response.ok) {
                    const data = await response.json();
                    throw {
                        error: i18n(data.error) || i18n("common:unexpectedError"),
                        status: response.status
                    };
                }

                // Show success message on successful recovery
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
    }, [state.name, state.description, state.messageDialog, state.tracks]);

    /**
     * Handles deleting the playlist.
     */
    const handleDelete = useCallback(async (): Promise<void> => {
        setState((prev) => ({
            ...prev,
            messageDialog: { isOpen: true, message: "", onClose: null, type: MessageDialogState.Loading }
        }));

        try {
            // Retrieve user authentication token
            const token = localStorage?.getItem("authToken");
            if (!token) return;

            // Send API request to delete the playlist
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
            if (!response.ok) {
                const data = await response.json();
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            // On successful deletion, show success message and trigger onDelete
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("userPlaylists:playlistDeleted"),
                    onClose: (): void => {
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
    }, [playlist.playlistId, state.messageDialog, onDelete]);

    return {
        handleDelete,
        handleRecover,
        handleSave,
        setState,
        state,
        toggleExpand
    };
}
