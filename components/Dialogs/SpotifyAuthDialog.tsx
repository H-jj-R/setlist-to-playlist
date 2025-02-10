/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface SpotifyAuthDialogProps {
    onClose: () => void;
}

/**
 *
 */
const SpotifyAuthDialog: React.FC<SpotifyAuthDialogProps> = ({ onClose }): JSX.Element => {
    const router = useRouter();
    const { t: i18n } = useTranslation();

    return (
        <div id="dialog-container" className="fixed inset-0 z-50 flex items-center justify-center">
            <div id="background-overlay" className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div
                id="dialog-box"
                className={
                    "relative w-3/5 max-w-md rounded-lg border-4 border-green-500 bg-white p-6 text-center shadow-lg dark:bg-gray-800"
                }
            >
                <button
                    className="absolute left-2 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={i18n("common:close")}
                    onClick={onClose}
                >
                    <FontAwesomeIcon className="h-6 w-6" icon={faTimes} />
                </button>
                <div className="p-4">
                    <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {i18n("exportSetlist:spotifyAuthRequired")}
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">{i18n("exportSetlist:spotifyAuthMessage")}</p>
                    <button
                        className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
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
