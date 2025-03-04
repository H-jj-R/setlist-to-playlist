/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import useSetlistSongsExportHook from "@hooks/useSetlistSongsExportHook";
import Image from "next/image";
import { useTranslation } from "react-i18next";

/**
 * Props for the `SetlistSongsExport` component.
 *
 * @property {Record<string, any>} artistData - The data containing artist details.
 * @property {Function} onSongsFetched - Callback function triggered once songs are retrieved.
 * @property {boolean} [predictedSetlist] - Indicates whether the setlist is AI-predicted.
 * @property {Record<string, any>} setlist - The setlist data containing song details.
 */
interface SetlistSongsExportProps {
    artistData: Record<string, any>;
    onSongsFetched: (songs: Record<string, any>[]) => void;
    predictedSetlist?: boolean;
    setlist: Record<string, any>;
}

/**
 * **SetlistSongsExport Component**
 *
 * This component fetches and displays songs from a setlist as they will appear in an exported Spotify playlist.
 *
 * @param SetlistSongsExportProps - The component props.
 *
 * @returns {JSX.Element} The rendered `SetlistSongsExport` component.
 */
const SetlistSongsExport: React.FC<SetlistSongsExportProps> = ({
    artistData,
    onSongsFetched,
    predictedSetlist,
    setlist
}): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage song data and state
    const { state, toggleExcludeSong } = useSetlistSongsExportHook(
        artistData,
        onSongsFetched,
        setlist,
        predictedSetlist
    );

    return (
        <div
            id="exported-setlist-container"
            className="flex h-full w-full flex-col overflow-y-auto rounded-lg bg-gray-100 p-3 shadow-md dark:bg-gray-700"
        >
            {state.loading ? (
                <div id="loader-container" className="flex h-full items-center justify-center">
                    <CustomHashLoader showLoading={true} size={100} />
                </div>
            ) : state.error ? (
                <ErrorMessage message={state.error} />
            ) : (
                <>
                    <h4 id="exported-setlist-title" className="mb-2 text-lg font-semibold">
                        {i18n("exportSetlist:songs")}
                    </h4>
                    <ul id="exported-setlist-tracks" className="space-y-1">
                        {state.spotifySongs?.map(
                            (spotifySong: Record<string, any>, idx: number): JSX.Element =>
                                spotifySong?.name ? (
                                    <li
                                        id={`song-item-${spotifySong?.id}`}
                                        className={`cursor-pointer py-2 ${
                                            state.excludedSongs.has(`${spotifySong?.id}-${idx}`) ? "opacity-20" : ""
                                        }`}
                                        key={`${idx}-${spotifySong.name || "unknown"}`}
                                        onClick={(): void => toggleExcludeSong(spotifySong.id, idx)}
                                    >
                                        <div id="song-details-container" className="flex items-center space-x-4">
                                            {spotifySong?.album?.images[0]?.url && (
                                                <Image
                                                    id="song-cover-img"
                                                    className="h-12 w-12 rounded-sm shadow-sm"
                                                    alt={
                                                        spotifySong.name
                                                            ? `${spotifySong.name} ${i18n("common:image")}`
                                                            : i18n("common:songCoverArt")
                                                    }
                                                    height={700}
                                                    src={
                                                        spotifySong.album.images[0]?.url ||
                                                        "/images/song-placeholder.jpg"
                                                    }
                                                    width={700}
                                                />
                                            )}
                                            <div>
                                                <p id="song-name" className="font-medium">
                                                    {spotifySong?.name}
                                                </p>
                                                <p id="song-artist" className="text-sm text-gray-500">
                                                    {spotifySong?.artists?.[0]?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ) : (
                                    !state.hideSongsNotFound && (
                                        <li
                                            id={`song-not-found-${idx}`}
                                            className="py-2 text-red-500"
                                            key={`${idx}-${spotifySong?.name || "unknown"}`}
                                        >
                                            <ErrorMessage
                                                message={`${i18n("exportSetlist:songNotFound")}: ${
                                                    predictedSetlist
                                                        ? setlist?.predictedSongs?.[idx]?.name ||
                                                          i18n("exportSetlist:unknownSong")
                                                        : ((setlist?.sets?.set?.flatMap(
                                                              (set: Record<string, any>) => set.song
                                                          ) ?? [])[
                                                              setlist?.sets?.set?.[0]?.song?.[0]?.name !== ""
                                                                  ? idx
                                                                  : idx + 1
                                                          ]?.name ?? i18n("exportSetlist:unknownSong"))
                                                }`}
                                                small={true}
                                            />
                                        </li>
                                    )
                                )
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SetlistSongsExport;
