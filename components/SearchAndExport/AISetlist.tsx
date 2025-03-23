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
 * @property {boolean} isThinView - Indicates whether to change the way AISetlist is displayed based on page width.
 * @property {Function} onExport - Function to trigger the export of the setlist to Spotify.
 * @property {number} predictionNum - The index or number of the AI-generated prediction.
 * @property {Record<string, any>} setlist - The AI-generated setlist data.
 */
interface AISetlistProps {
    isThinView: boolean;
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
 * @returns The rendered `AISetlist` component.
 */
const AISetlist: React.FC<AISetlistProps> = ({ isThinView, onExport, predictionNum, setlist }) => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Safely access the setlist song data from the setlist prop
    const setlistDataArray: Record<string, any>[] = isThinView
        ? Array.isArray(setlist)
            ? setlist
            : [setlist]
        : [Array.isArray(setlist) && setlist.length > 0 ? setlist[0] : {}];

    return (
        <div
            id="setlist-container"
            className="animate-fade-in h-[calc(100vh-12rem)] overflow-y-auto rounded-lg border-4 border-gray-300 bg-white px-5 text-gray-800 shadow-lg dark:bg-gray-800 dark:text-gray-200"
        >
            {!isThinView ? (
                <div id="export-btn-container" className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800">
                    <div id="export-spotify-btn-container" className="mb-4 flex items-center justify-between pt-4 pb-2">
                        <button
                            id="export-spotify-btn"
                            className="mr-auto ml-auto w-full rounded-sm bg-green-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-green-600 focus:ring-3 focus:ring-green-300"
                            onClick={(): void => onExport(setlistDataArray[0])}
                            role="button"
                        >
                            {i18n("common:exportToSpotify")}
                        </button>
                    </div>
                </div>
            ) : (
                <div id="setlist-container-padding" className="mt-4" />
            )}
            {!isThinView && (
                <h2 id="setlist-artist" className="mb-4 text-3xl font-bold">
                    {i18n("setlistSearch:setlistPrediction", { count: predictionNum })}
                </h2>
            )}
            {setlistDataArray.map((setlistData, idx) => (
                <div id={`setlist-contents-${idx}`} className="mb-4" key={idx}>
                    {isThinView && (
                        <>
                            <button
                                id={`export-spotify-btn-${idx}`}
                                className="mr-auto mb-4 ml-auto w-full rounded-sm bg-green-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-green-600 focus:ring-3 focus:ring-green-300"
                                onClick={(): void => onExport(setlistData)}
                                role="button"
                            >
                                {i18n("common:exportToSpotify")}
                            </button>
                            <h3 id={`setlist-header-${idx}`} className="mb-4 text-3xl font-bold">
                                {i18n("setlistSearch:setlistPrediction", { count: idx + 1 })}
                            </h3>
                        </>
                    )}
                    {setlistData.predictedSongs && setlistData.predictedSongs.length > 0 ? (
                        <ul id="songs-list" className="space-y-1 pb-6">
                            {setlistData.predictedSongs.map((song: any, songIdx: number) => (
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
                            ))}
                        </ul>
                    ) : (
                        <p id="no-songs-message" className="text-center italic">
                            {i18n("setlistSearch:noSongsFound")}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AISetlist;
