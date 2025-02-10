/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import UserPlaylist from "@components/Account/UserPlaylist";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import Layout from "@components/Shared/Layout";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Main page for viewing user playlists.
 */
export default function UserPlaylists(): JSX.Element {
    const { isAuthenticated } = useAuth();
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({
        error: null as null | string,
        loading: false,
        playlists: [] as Record<string, any>[]
    });

    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    useEffect((): void => {
        if (isAuthenticated) {
            fetchPlaylists();
        }
    }, [isAuthenticated]);

    const fetchPlaylists = async (): Promise<void> => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const response = await fetch("/api/database/get-user-playlists", {
                headers: {
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`,
                    "Content-Type": "application/json"
                },
                method: "POST"
            });
            const data = await response.json();

            if (!response.ok) {
                throw {
                    error: i18n(data.error) || i18n("common:unexpectedError"),
                    status: response.status
                };
            }

            setState((prev) => ({ ...prev, playlists: data.playlists }));
        } catch (error) {
            setState((prev) => ({ ...prev, error: error.error }));
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    if (!mounted) return null;

    return (
        <Layout>
            <div className="h-screen overflow-y-scroll">
                {!isAuthenticated ? (
                    // Dialog displayed when the user is not authenticated
                    <div className="mt-8 flex items-center justify-center">
                        <div className="relative top-2/3 rounded-lg bg-gradient-to-r from-red-500 to-orange-600 p-8 text-center text-white shadow-lg">
                            <h2 className="mb-4 text-2xl font-bold">{i18n("common:authenticationRequired")}</h2>
                            <p className="mb-6 text-lg">{i18n("common:needToLogIn")}</p>
                        </div>
                    </div>
                ) : state.error ? (
                    <div id="error-message" className="mx-auto mt-5 max-w-4xl pt-8">
                        <ErrorMessage message={state.error} />
                    </div>
                ) : state.loading ? (
                    <div id="loading-indicator" className="mt-16 flex items-center justify-center pt-8">
                        <CustomHashLoader showLoading={state.loading} size={120} />
                    </div>
                ) : (
                    <div className="p-4">
                        <h1 className="mb-4 flex justify-center text-2xl font-bold">
                            {i18n("userPlaylists:yourExportedSetlists")}
                        </h1>
                        {state.playlists.length === 0 ? (
                            <h2 className="flex justify-center pt-5 text-xl font-bold">
                                {i18n("userPlaylists:noPlaylistsCreated")}
                            </h2>
                        ) : (
                            <ul className="space-y-4">
                                {state.playlists.map(
                                    (playlist: Record<string, any>, idx: number): JSX.Element => (
                                        <div
                                            className="flex items-center justify-center"
                                            key={`${idx}-${playlist.playlistId}`}
                                        >
                                            <UserPlaylist
                                                onDelete={(playlistId: number): void => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        playlists: prev.playlists.filter(
                                                            (playlist: Record<string, any>): boolean =>
                                                                playlist.playlistId !== playlistId
                                                        )
                                                    }));
                                                }}
                                                playlist={playlist}
                                            />
                                        </div>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
