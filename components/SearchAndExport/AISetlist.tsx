/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

/**
 * Props for the `AISetlist` component.
 *
 * @property {Function} onExport - Function to trigger the export of the setlist to Spotify.
 * @property {number} predictionNum - The index or number of the AI-generated prediction.
 * @property {Record<string, any>} setlist - The AI-generated setlist data.
 */
interface AISetlistProps {
    onExport: (setlist: Record<string, any>) => void;
    predictionNum: number;
    setlist: Record<string, any>;
}

/**
 * **AISetlist Component**
 *
 * Displays a setlist from it's predicted AI-generated details.
 *
 * @param AISetlistProps - Component props.
 *
 * @returns {JSX.Element} The rendered `AISetlist` component.
 */
const AISetlist: React.FC<AISetlistProps> = ({ onExport, predictionNum, setlist }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Safely access the first element of the setlist array
    const setlistData = Array.isArray(setlist) && setlist.length > 0 ? setlist[0] : {};

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border-4 border-gray-300 bg-white px-5 text-gray-800 shadow-lg dark:bg-gray-800 dark:text-gray-200"
        >
            <div id="export-btn-container" className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800">
                <div id="export-spotify-btn-container" className="mb-4 flex items-center justify-between pt-4 pb-2">
                    <button
                        id="export-spotify-btn"
                        className="mr-auto ml-auto w-full rounded-sm bg-green-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-green-600 focus:ring-3 focus:ring-green-300 sm:w-auto"
                        onClick={(): void => onExport(setlistData)}
                    >
                        {i18n("common:exportToSpotify")}
                    </button>
                </div>
            </div>
            <div id="setlist-header" className="mb-4">
                <h2 id="setlist-artist" className="text-3xl font-bold">
                    {i18n("setlistSearch:setlistPrediction", { count: predictionNum })}
                </h2>
            </div>
            {setlistData.predictedSongs && setlistData.predictedSongs.length > 0 ? (
                <ul id="songs-list" className="space-y-1 pb-6">
                    {setlistData.predictedSongs.map(
                        (song: any, songIdx: number): JSX.Element => (
                            <li
                                id={`song-item-${song.name || "unknown"}`}
                                className={`py-2 ${
                                    songIdx !== setlistData.predictedSongs.length - 1
                                        ? "border-b border-gray-200 dark:border-gray-700"
                                        : ""
                                }`}
                                key={`${songIdx}-${song.name || "unknown"}`}
                            >
                                <div id="song-details-container" className="flex items-center justify-between">
                                    <div id="song-name-container" className="flex items-center space-x-2">
                                        {song.tape && (
                                            <FontAwesomeIcon
                                                id="fa-record-vinyl-icon"
                                                className="opacity-80"
                                                icon={faRecordVinyl}
                                                title={i18n("setlistSearch:playedFromTape")}
                                            />
                                        )}
                                        <span id="song-name" className={"font-medium"}>
                                            {song.name}
                                        </span>
                                    </div>
                                    <div
                                        id="additional-song-details"
                                        className="max-w-[60%] text-right text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        {song.cover &&
                                            `${song.cover.name} ${song.tape ? i18n("setlistSearch:song") : i18n("setlistSearch:cover")}`}
                                    </div>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            ) : (
                <p id="no-songs-message" className="text-center italic">
                    {i18n("setlistSearch:noSongsFound")}
                </p>
            )}
        </div>
    );
};

export default AISetlist;
