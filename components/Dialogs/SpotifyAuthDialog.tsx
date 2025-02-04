import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface SpotifyAuthDialogProps {
    onClose: () => void;
}

/**
 * 
 */
const SpotifyAuthDialog: React.FC<SpotifyAuthDialogProps> = ({ onClose }) => {
    const { t: i18n } = useTranslation();
    const router = useRouter();

    const handleAuthorise = () => {
        router.push(
            `/api/spotify/authorise?${new URLSearchParams({
                redirect: window.location.pathname + window.location.search
            }).toString()}`
        );
    };

    return (
        <div id="dialog-container" className="fixed inset-0 flex items-center justify-center z-50">
            <div id="overlay" className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div
                id="dialog-box"
                className={
                    "relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-3/5 max-w-md text-center border-green-500 border-4"
                }
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 left-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={i18n("common:close")}
                >
                    <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                </button>
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
                        {i18n("exportSetlist:spotifyAuthRequired")}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{i18n("exportSetlist:spotifyAuthMessage")}</p>
                    <button
                        onClick={handleAuthorise}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        {i18n("exportSetlist:authoriseWithSpotify")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpotifyAuthDialog;
