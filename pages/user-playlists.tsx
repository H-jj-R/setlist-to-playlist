import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

/**
 * Main page for viewing setlists.
 */
export default function AIGenerateSetlist() {
    const { isAuthenticated } = useAuth();
    const { resolvedTheme } = useTheme();
    const { t: i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [state, setState] = useState({});

    useEffect(() => {
        setMounted(true);
        document.body.style.backgroundColor = resolvedTheme === "dark" ? "#111827" : "#f9f9f9";
    }, [resolvedTheme]);

    if (!mounted) return null;

    return (
        <Layout>
            {!isAuthenticated ? (
                // Dialog displayed when the user is not authenticated
                <div className="flex items-center justify-center">
                    <div className="relative top-2/3 p-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg shadow-lg text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                        <p className="text-lg mb-6">You need to log in to access this feature.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div>CONTENT HERE</div>
                    <div>TODO: Get user playlists from DB</div>
                </>
            )}
        </Layout>
    );
}
