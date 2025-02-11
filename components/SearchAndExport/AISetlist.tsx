/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface AISetlistProps {
    onExport: (setlist: Record<string, any>) => void; // Function to trigger Spotify export
    predictionNum: number; // The number of the prediction
    setlist: Record<string, any>; // The setlist data to be displayed
}

/**
 * Displays a setlist from it's predicted AI-generated details.
 */
const AISetlist: React.FC<AISetlistProps> = ({ onExport, predictionNum, setlist }): JSX.Element => {
    const { t: i18n } = useTranslation();

    // Safely access the first element of the setlist array
    const setlistData = Array.isArray(setlist) && setlist.length > 0 ? setlist[0] : {};

    const SongListItem = ({ isLast, song }: { isLast: boolean; song: any }): JSX.Element => (
        <li
            id={`song-item-${song.name || "unknown"}`}
            className={`py-2 ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
        >
            <div id="song-details-container" className="flex items-center justify-between">
                <div id="song-name-container" className="flex items-center space-x-2">
                    {/* Tape indicator icon */}
                    {song.tape && (
                        <FontAwesomeIcon
                            id="fa-record-vinyl-icon"
                            className="opacity-80"
                            icon={faRecordVinyl}
                            title={i18n("setlistSearch:playedFromTape")}
                        />
                    )}
                    {/* Song name */}
                    <span id="song-name" className={"font-medium"}>
                        {song.name}
                    </span>
                </div>
                {/* Additional song details */}
                <div
                    id="additional-song-details"
                    className="max-w-[60%] text-right text-sm text-gray-500 dark:text-gray-400"
                >
                    {song.cover &&
                        `${song.cover.name} ${song.tape ? i18n("setlistSearch:song") : i18n("setlistSearch:cover")}`}
                </div>
            </div>
        </li>
    );

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border-4 border-gray-300 bg-white px-5 text-gray-800 shadow-lg dark:bg-gray-800 dark:text-gray-200"
        >
            {/* Container for buttons */}
            <div id="export-btn-container" className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800">
                <div id="export-spotify-btn-container" className="mb-4 flex items-center justify-between pb-2 pt-4">
                    {/* Export to Spotify Button */}
                    <button
                        id="export-spotify-btn"
                        className="ml-auto mr-auto w-full rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600 focus:ring focus:ring-green-300 sm:w-auto"
                        onClick={(): void => onExport(setlistData)}
                    >
                        {i18n("common:exportToSpotify")}
                    </button>
                </div>
            </div>

            {/* Setlist Header */}
            <div id="setlist-header" className="mb-4">
                <h2 id="setlist-artist" className="text-3xl font-bold">
                    {i18n("setlistSearch:setlistPrediction", { count: predictionNum })}
                </h2>
            </div>

            {/* Songs List */}
            {setlistData.predictedSongs && setlistData.predictedSongs.length > 0 ? (
                <ul id="songs-list" className="space-y-1 pb-6">
                    {setlistData.predictedSongs.map((song: any, songIdx: number): JSX.Element => {
                        return (
                            <SongListItem
                                isLast={songIdx === setlistData.predictedSongs.length - 1}
                                key={`${songIdx}-${song.name || "unknown"}`}
                                song={song}
                            />
                        );
                    })}
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
