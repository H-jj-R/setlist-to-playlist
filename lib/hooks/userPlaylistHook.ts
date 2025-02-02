import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

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
        loading: false,
        error: null as string | null,
        showConfirmation: false
    });

    const toggleExpand = async () => {
        setState((prev) => ({
            ...prev,
            expanded: !state.expanded
        }));
        if (!state.tracks && !state.loading) {
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
            loading: true,
            error: null
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
                    error: i18n(data.error) || i18n("errors:unexpectedError")
                };
            }

            return data.tracks;
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
    };

    const handleSave = async () => {
        setState((prev) => ({
            ...prev,
            loading: true,
            error: null
        }));

        try {
            if (!state.name.trim()) {
                throw {
                    status: 400,
                    error: i18n("errors:noNameProvided")
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
                    error: i18n(data.error) || i18n("errors:unexpectedError")
                };
            }

            setState((prev) => ({
                ...prev,
                initialName: state.name,
                initialDescription: state.description,
                editing: false
            }));
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
    };

    const handleRecover = async () => {
        setState((prev) => ({
            ...prev,
            loading: true,
            error: null
        }));

        try {
            const response = await fetch("/api/controllers/check-for-authentication", {
                method: "GET",
                credentials: "include"
            });
            if (response.status === 401) {
                router.push(
                    `/api/spotify/authorise?${new URLSearchParams({
                        redirect: window.location.pathname + window.location.search
                    }).toString()}`
                );
            } else if (response.status == 200) {
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
                        error: i18n(responseJson.error) || i18n("errors:unexpectedError")
                    };
                }
            }
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
    };

    const handleDelete = async () => {
        setState((prev) => ({
            ...prev,
            loading: true,
            error: null
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
                    error: i18n(data.error) || i18n("errors:unexpectedError")
                };
            }

            onDelete(playlist.playlistId);
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
