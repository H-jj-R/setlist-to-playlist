import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";

interface AISetlistProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    predictionNum: number; // The number of the prediction
    onExport: (setlist: Record<string, any>) => void; // Function to trigger Spotify export
}

/**
 * Displays a setlist from it's predicted AI-generated details.
 */
const AISetlist: React.FC<AISetlistProps> = ({ setlist, predictionNum, onExport }) => {
    const { t: i18n } = useTranslation();

    // Safely access the first element of the setlist array
    const setlistData = Array.isArray(setlist) && setlist.length > 0 ? setlist[0] : {};

    const SongListItem = ({ song, isLast }: { song: any; isLast: boolean }) => (
        <li
            id={`song-item-${song.name || "unknown"}`}
            className={`py-2 ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Tape indicator icon */}
                    {song.tape && (
                        <FontAwesomeIcon icon={faRecordVinyl} className="opacity-80" title="Played from tape" />
                    )}
                    {/* Song name */}
                    <span className={"font-medium"}>{song.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right max-w-[60%]">
                    {/* Additional song details */}
                    {song.cover && `${song.cover.name} ${song.tape ? "song" : "cover"}`}
                </div>
            </div>
        </li>
    );

    return (
        <div
            id="setlist-container"
            className="px-5 border border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg h-[calc(100vh-9rem)] overflow-y-auto"
        >
            {/* Container for buttons */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 w-full">
                <div id="setlist-buttons" className="flex justify-between items-center mb-4 pt-4 pb-2">
                    {/* Export to Spotify Button */}
                    <button
                        id="export-spotify-button"
                        className="ml-auto mr-auto px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:ring focus:ring-green-300 w-full sm:w-auto"
                        onClick={() => onExport(setlistData)}
                    >
                        {i18n("common:exportToSpotify")}
                    </button>
                </div>
            </div>

            {/* Setlist Header */}
            <div id="setlist-header" className="mb-4">
                <h2 id="setlist-artist" className="text-3xl font-bold">
                    {"Setlist Prediction " + predictionNum}
                </h2>
            </div>

            {/* Songs List */}
            {setlistData.predictedSongs && setlistData.predictedSongs.length > 0 ? (
                <ul id="songs-list" className="space-y-1 pb-6">
                    {setlistData.predictedSongs.map((song: any, songIdx: number) => {
                        return (
                            <SongListItem
                                key={`${songIdx}-${song.name || "unknown"}`}
                                song={song}
                                isLast={songIdx === setlistData.predictedSongs.length - 1}
                            />
                        );
                    })}
                </ul>
            ) : (
                <p id="no-songs-message" className="italic text-center">
                    {i18n("setlistSearch:noSongsFound")}
                </p>
            )}
        </div>
    );
};

export default AISetlist;
