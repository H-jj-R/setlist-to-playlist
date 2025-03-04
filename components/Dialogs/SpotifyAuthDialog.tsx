/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Props for the `SpotifyAuthDialog` component.
 *
 * @property {Function} onClose - Function to handle closing the dialog.
 */
interface SpotifyAuthDialogProps {
    onClose: () => void;
}

/**
 * **SpotifyAuthDialog Component**
 *
 * Provides a modal interface for users to authenticate with Spotify.
 *
 * @param SpotifyAuthDialogProps - Component props.
 *
 * @returns {JSX.Element} The rendered component.
 */
const SpotifyAuthDialog: React.FC<SpotifyAuthDialogProps> = ({ onClose }): JSX.Element => {
    const router = useRouter(); // Router hook
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div id="spotify-auth-dialog-container" className="fixed inset-0 z-50 flex items-center justify-center">
            <div id="background-overlay" className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div
                id="spotify-auth-dialog-box"
                className={
                    "relative w-3/5 max-w-md rounded-lg border-4 border-green-500 bg-white p-6 text-center shadow-lg dark:bg-gray-800"
                }
            >
                <button
                    id="close-btn"
                    className="absolute top-3 left-2 text-gray-500 transition hover:cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={i18n("common:close")}
                    onClick={onClose}
                >
                    <FontAwesomeIcon id="fa-times-icon" className="h-6 w-6" icon={faTimes} />
                </button>
                <div id="dialog-contents" className="p-4">
                    <h2
                        id="dialog-title"
                        className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100"
                    >
                        {i18n("exportSetlist:spotifyAuthRequired")}
                    </h2>
                    <p id="dialog-message" className="mb-6 text-gray-700 dark:text-gray-300">
                        {i18n("exportSetlist:spotifyAuthMessage")}
                    </p>
                    <button
                        id="spotify-auth-btn"
                        className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-green-600"
                        onClick={(): void => {
                            router.push(
                                `/api/spotify/authorise?${new URLSearchParams({
                                    redirect: window.location.pathname + window.location.search
                                }).toString()}`
                            );
                        }}
                    >
                        {i18n("exportSetlist:authoriseWithSpotify")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpotifyAuthDialog;
