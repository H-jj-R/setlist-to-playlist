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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Main page for viewing user playlists.
 *
 * @returns The rendered `/user-playlists` page.
 */
export default function UserPlaylists() {
    const router = useRouter(); // Router hook
    const { isAuthenticated } = useAuth(); // Authentication context
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const { t: i18n } = useTranslation(); // Translation hook
    const [mounted, setMounted] = useState(false); // Tracks if the component has mounted
    const [state, setState] = useState({
        error: null as null | string, // Tracks any errors
        loading: false, // Tracks if the component is loading
        playlists: [] as Record<string, any>[] // Tracks the user's playlists
    });

    /**
     * Sets the component as mounted when first rendered.
     */
    useEffect((): void => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    /**
     * Fetches the user's playlists when the component mounts or when authentication status changes.
     */
    useEffect((): void => {
        if (isAuthenticated) fetchPlaylists();
    }, [isAuthenticated]);

    /**
     * Fetches the user's playlists from the database.
     */
    const fetchPlaylists = async (): Promise<void> => {
        setState((prev) => ({ ...prev, loading: true }));
        try {
            // Get user playlists from the database
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

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <Layout>
            <div id="user-playlists-container" className="h-screen overflow-y-scroll">
                {!isAuthenticated ? (
                    <div id="unauthenticated-dialog" className="mt-8 flex items-center justify-center">
                        <div
                            id="auth-required-message"
                            className="relative top-2/3 rounded-lg bg-linear-to-r from-red-500 to-orange-600 p-8 text-center text-white shadow-lg"
                        >
                            <h2 id="auth-required-title" className="mb-4 text-2xl font-bold">
                                {i18n("common:authenticationRequired")}
                            </h2>
                            <p id="auth-required-description" className="mb-6 text-lg">
                                {i18n("common:needToLogIn")}
                            </p>
                        </div>
                    </div>
                ) : state.error ? (
                    <div id="error-message-container" className="mx-auto mt-5 max-w-4xl pt-8">
                        <ErrorMessage message={state.error} />
                    </div>
                ) : state.loading ? (
                    <div id="loading-indicator-container" className="mt-16 flex items-center justify-center pt-8">
                        <CustomHashLoader showLoading={state.loading} size={120} />
                    </div>
                ) : (
                    <div id="playlists-container" className="p-4">
                        <h1 id="exported-setlists-title" className="mb-4 flex justify-center text-2xl font-bold">
                            {i18n("userPlaylists:yourExportedSetlists")}
                        </h1>
                        {state.playlists.length === 0 ? (
                            <>
                                <h2 id="no-playlists-message" className="flex justify-center pt-5 text-xl font-bold">
                                    {i18n("userPlaylists:noPlaylistsCreated")}
                                </h2>
                                <h3
                                    id="no-playlists-message"
                                    className="mt-18 flex justify-center pt-5 text-xl font-bold"
                                >
                                    {i18n("userPlaylists:exportFirstPlaylist")}
                                </h3>
                                <div className="mt-6 flex justify-center gap-4">
                                    <button
                                        id="go-to-setlist-search-btn"
                                        className="min-w-[18rem] rounded-full bg-linear-to-r from-pink-600 to-orange-500 px-12 py-5 text-lg font-semibold text-white shadow-md transition hover:cursor-pointer hover:bg-gray-700 focus:outline-none"
                                        onClick={(): Promise<boolean> => router.push("/setlist-search")}
                                    >
                                        {i18n("userPlaylists:searchSetlists")}
                                    </button>
                                    <button
                                        id="go-to-ai-generate-setlist-btn"
                                        className="min-w-[18rem] rounded-full bg-linear-to-r from-sky-500 to-purple-700 px-12 py-5 text-lg font-semibold text-white shadow-md transition hover:cursor-pointer hover:bg-gray-700 focus:outline-none"
                                        onClick={(): Promise<boolean> => router.push("/ai-generate-setlist")}
                                    >
                                        {i18n("userPlaylists:aiGenerateSetlist")}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <ul id="playlists-list" className="space-y-4">
                                {state.playlists.map((playlist: Record<string, any>, idx: number) => (
                                    <div
                                        id={`user-playlist-${playlist.playlistId}-container`}
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
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
