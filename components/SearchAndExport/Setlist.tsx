/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import formatDate from "@utils/formatDate";
import formatLocation from "@utils/formatLocation";
import { useTranslation } from "react-i18next";

/**
 * Props for the `Setlist` component.
 *
 * @property {boolean} [isAlone] - Whether the setlist should be formatted differently based on what else is on the page.
 * @property {Function} onClose - Function to handle closing the setlist view (navigate back to the list).
 * @property {Function} onExport - Function to trigger exporting the setlist to Spotify.
 * @property {Record<string, any>} setlist - The setlist data retrieved from setlist.fm.
 */
interface SetlistProps {
    isAlone?: boolean;
    onClose: () => void;
    onExport: () => void;
    setlist: Record<string, any>;
}

/**
 * **Setlist Component**
 *
 * Displays a setlist and it's details from it's setlist.fm data.
 *
 * @param SetlistProps - The component props.
 *
 * @returns The rendered `Setlist` component.
 */
const Setlist: React.FC<SetlistProps> = ({ isAlone = false, onClose, onExport, setlist }) => {
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div
            id="setlist-container"
            className={`animate-fade-in h-[calc(100vh-9rem)] overflow-y-auto rounded-lg border-4 border-gray-300 bg-white px-5 text-gray-800 shadow-lg dark:bg-gray-800 dark:text-gray-200 ${isAlone ? "mx-auto w-4/5 sm:w-1/2" : "w-full"}`}
        >
            <div id="setlist-btns-container" className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800">
                <div
                    id="setlist-btns"
                    className={`mb-6 flex items-stretch justify-between pt-4 pb-2 ${!isAlone && "space-x-8"}`}
                >
                    {!isAlone ? (
                        <button
                            id="back-btn"
                            className="min-h-[44px] w-full rounded-sm bg-red-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-red-600 focus:ring-3 focus:ring-red-300 sm:w-auto"
                            onClick={onClose}
                            role="button"
                        >
                            {i18n("setlistSearch:backToList")}
                        </button>
                    ) : (
                        <div id="back-btn-placeholder" className="flex-1" />
                    )}
                    <button
                        id="export-spotify-btn"
                        className="min-h-[44px] w-full rounded-sm bg-green-500 px-4 py-2 font-semibold text-white transition hover:cursor-pointer hover:bg-green-600 focus:ring-3 focus:ring-green-300 sm:w-auto"
                        onClick={onExport}
                        role="button"
                    >
                        {i18n("common:exportToSpotify")}
                    </button>
                </div>
            </div>

            <div id="setlist-header" className="mb-4">
                <h2 id="setlist-artist" className="text-3xl font-bold">
                    {setlist.artist.name}
                </h2>
                <p id="setlist-location" className="mt-1 text-lg">
                    {formatLocation(setlist)}
                </p>
                <p id="setlist-date" className="text-sm text-gray-500 dark:text-gray-400">
                    {i18n("setlistSearch:setlistDate", { date: formatDate(setlist.eventDate) })}
                </p>
            </div>
            {setlist.sets && setlist.sets.set.length > 0 ? (
                <ul id="songs-list" className="space-y-1 pb-6">
                    {setlist.sets.set.flatMap(
                        (set: Record<string, any>, setIdx: number, setArray: Record<string, any>[]) =>
                            set.song.map((song: Record<string, any>, songIdx: number) => (
                                <li
                                    id={`song-item-${song.name || "unknown"}`}
                                    className={`py-2 ${
                                        setIdx === setArray.length - 1 && songIdx === set.song.length - 1
                                            ? ""
                                            : "border-b border-gray-200 dark:border-gray-700"
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
                                            <span
                                                id="song-name"
                                                className={`font-medium ${song.tape ? "italic opacity-80" : ""}`}
                                            >
                                                {song.name ||
                                                    (song.tape && !song.name
                                                        ? setIdx === 0 && songIdx === 0
                                                            ? i18n("setlistSearch:intro")
                                                            : i18n("setlistSearch:interlude")
                                                        : `(${i18n("setlistSearch:unknown")})`)}
                                            </span>
                                        </div>
                                        <div
                                            id="additional-song-details"
                                            className="max-w-[60%] text-right text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {song.cover &&
                                                `${song.cover.name} ${
                                                    song.tape ? i18n("setlistSearch:song") : i18n("setlistSearch:cover")
                                                }${song.info ? "," : ""}`}
                                            {song.info && ` ${song.info[0].toUpperCase() + song.info.slice(1)}`}
                                            {song.with &&
                                                `(${i18n("setlistSearch:with", { withName: song.with.name })})`}
                                        </div>
                                    </div>
                                </li>
                            ))
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

export default Setlist;
