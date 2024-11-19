import React from "react";
import { useRouter } from "next/router";

export default function SpotifyAuthorise() {
    const router = useRouter();
    const { redirect } = router.query;

    const handleLogin = async () => {
        router.push(`/api/spotify/authorise?redirect=${redirect}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <button
                className="px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={handleLogin}
            >
                Authenticate with Spotify
            </button>
        </div>
    );
}
