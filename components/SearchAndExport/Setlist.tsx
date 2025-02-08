/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import formatDate from "@utils/formatDate";
import formatLocation from "@utils/formatLocation";

interface SetlistProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClose: () => void; // Function to handle the close action (navigate back to the list)
    onExport: () => void; // Function to trigger Spotify export
}

/**
 * Displays a setlist from it's setlist.fm details.
 */
const Setlist: React.FC<SetlistProps> = ({ setlist, onClose, onExport }) => {
    const { t: i18n } = useTranslation();

    const SongListItem = ({ song, isFirst, isLast }: { song: any; isFirst: boolean; isLast: boolean }) => (
        <li
            id={`song-item-${song.name || "unknown"}`}
            className={`py-2 ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Tape indicator icon */}
                    {song.tape && (
                        <FontAwesomeIcon
                            icon={faRecordVinyl}
                            className="opacity-80"
                            title={i18n("setlistSearch:playedFromTape")}
                        />
                    )}
                    {/* Song name */}
                    <span className={`font-medium ${song.tape ? "italic opacity-80" : ""}`}>
                        {song.name ||
                            (song.tape && !song.name
                                ? isFirst
                                    ? i18n("setlistSearch:intro")
                                    : i18n("setlistSearch:interlude")
                                : `(${i18n("setlistSearch:unknown")})`)}
                    </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right max-w-[60%]">
                    {/* Additional song details */}
                    {song.cover &&
                        `${song.cover.name} ${song.tape ? i18n("setlistSearch:song") : i18n("setlistSearch:cover")}${
                            song.info ? "," : ""
                        }`}
                    {song.info && ` ${song.info[0].toUpperCase() + song.info.slice(1)}`}
                    {song.with && `(${i18n("setlistSearch:with", { withName: song.with.name })})`}
                </div>
            </div>
        </li>
    );

    return (
        <div
            id="setlist-container"
            className="px-5 border-4 border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg h-[calc(100vh-9rem)] overflow-y-auto"
        >
            {/* Container for buttons */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 w-full">
                <div id="setlist-buttons" className="flex justify-between items-center mb-6 pt-4 pb-2">
                    {/* Back Button */}
                    <button
                        id="back-button"
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:ring focus:ring-red-300 w-full sm:w-auto"
                        onClick={onClose}
                    >
                        {i18n("setlistSearch:backToList")}
                    </button>

                    {/* Export to Spotify Button */}
                    <button
                        id="export-spotify-button"
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:ring focus:ring-green-300 w-full sm:w-auto"
                        onClick={onExport}
                    >
                        {i18n("common:exportToSpotify")}
                    </button>
                </div>
            </div>

            {/* Setlist Header */}
            <div id="setlist-header" className="mb-4">
                <h2 id="setlist-artist" className="text-3xl font-bold">
                    {setlist.artist.name}
                </h2>
                <p id="setlist-location" className="text-lg mt-1">
                    {formatLocation(setlist)}
                </p>
                <p id="setlist-date" className="text-sm text-gray-500 dark:text-gray-400">
                    {i18n("setlistSearch:setlistDate", { date: formatDate(setlist.eventDate) })}
                </p>
            </div>

            {/* Songs List */}
            {setlist.sets && setlist.sets.set.length > 0 ? (
                <ul id="songs-list" className="space-y-1 pb-6">
                    {setlist.sets.set.flatMap((set: any, setIdx: number, setArray: any[]) =>
                        set.song.map((song: any, songIdx: number) => {
                            return (
                                <SongListItem
                                    key={`${songIdx}-${song.name || "unknown"}`}
                                    song={song}
                                    isFirst={setIdx === 0 && songIdx === 0}
                                    isLast={setIdx === setArray.length - 1 && songIdx === set.song.length - 1}
                                />
                            );
                        })
                    )}
                </ul>
            ) : (
                <p id="no-songs-message" className="italic text-center">
                    {i18n("setlistSearch:noSongsFound")}
                </p>
            )}
        </div>
    );
};

export default Setlist;
