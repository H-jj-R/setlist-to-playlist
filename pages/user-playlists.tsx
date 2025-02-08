import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import Layout from "@components/Shared/Layout";
import UserPlaylist from "@components/Account/UserPlaylist";
import { useAuth } from "@context/AuthContext";

/**
 * Main page for viewing user playlists.
 */
export default function UserPlaylists() {
    const { t: i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPlaylists();
        }
    }, [isAuthenticated]);

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/database/get-user-playlists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(data.error) || i18n("common:unexpectedError")
                };
            }

            setPlaylists(data.playlists);
        } catch (error) {
            setError(error.error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistDelete = (playlistId: number) => {
        setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.playlistId !== playlistId));
    };

    if (!mounted) return null;

    return (
        <Layout>
            <div className="h-screen overflow-y-scroll">
                {!isAuthenticated ? (
                    // Dialog displayed when the user is not authenticated
                    <div className="flex items-center justify-center mt-8">
                        <div className="relative top-2/3 p-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-lg text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">{i18n("common:authenticationRequired")}</h2>
                            <p className="text-lg mb-6">{i18n("common:needToLogIn")}</p>
                        </div>
                    </div>
                ) : error ? (
                    <div id="error-message" className="pt-8 mt-5 max-w-4xl mx-auto">
                        <ErrorMessage message={error} />
                    </div>
                ) : loading ? (
                    <div id="loading-indicator" className="pt-8 mt-16 flex justify-center items-center">
                        <CustomHashLoader showLoading={loading} size={120} />
                    </div>
                ) : (
                    <div className="p-4">
                        <h1 className="flex justify-center text-2xl font-bold mb-4">
                            {i18n("userPlaylists:yourExportedSetlists")}
                        </h1>
                        {playlists.length === 0 ? (
                            <h2 className="flex justify-center text-xl font-bold pt-5">
                                {i18n("userPlaylists:noPlaylistsCreated")}
                            </h2>
                        ) : (
                            <ul className="space-y-4">
                                {playlists.map((playlist, idx) => (
                                    <div
                                        key={`${idx}-${playlist.playlistId}`}
                                        className="flex justify-center items-center"
                                    >
                                        <UserPlaylist playlist={playlist} onDelete={handlePlaylistDelete} />
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
