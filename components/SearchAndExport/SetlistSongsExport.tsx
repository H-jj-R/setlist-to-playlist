/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import setlistSongsExportHook from "@hooks/setlistSongsExportHook";
import React from "react";
import { useTranslation } from "react-i18next";

interface SetlistSongsExportProps {
    artistData: Record<string, any>; // Artist information
    onSongsFetched: (songs: Record<string, any>[]) => void; // Callback to pass songs to ExportDialog
    predictedSetlist?: boolean; // Whether the setlist is predicted
    setlist: Record<string, any>; // The setlist data
}

/**
 * Displays setlist songs as from Spotify as they will be exported.
 */
const SetlistSongsExport: React.FC<SetlistSongsExportProps> = ({
    artistData,
    onSongsFetched,
    predictedSetlist,
    setlist
}) => {
    const { t: i18n } = useTranslation();
    const { state, toggleExcludeSong } = setlistSongsExportHook(setlist, artistData, onSongsFetched, predictedSetlist);

    const SongListItem = ({ spotifySong, idx }: { spotifySong: any; idx: number }) => (
        <li
            id={`song-item-${spotifySong?.id}`}
            className={`cursor-pointer py-2 ${
                state.excludedSongs.has(`${spotifySong?.id}-${idx}`) ? "opacity-20" : ""
            }`}
            onClick={() => toggleExcludeSong(spotifySong.id, idx)}
        >
            <div className="flex items-center space-x-4">
                {spotifySong?.album?.images[0]?.url && (
                    <img
                        id={`song-cover-${spotifySong?.id}`}
                        src={spotifySong.album.images[0].url}
                        alt={`${spotifySong.name} ${i18n("setlistSearch:image")}`}
                        className="h-12 w-12 rounded shadow"
                    />
                )}
                <div>
                    <p id={`song-name-${spotifySong?.id}`} className="font-medium">
                        {spotifySong?.name}
                    </p>
                    <p id={`song-artist-${spotifySong?.id}`} className="text-sm text-gray-500">
                        {spotifySong?.artists?.[0]?.name}
                    </p>
                </div>
            </div>
        </li>
    );

    return (
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-lg bg-gray-100 p-3 shadow-md dark:bg-gray-700">
            {state.loading ? (
                <div className="flex h-full items-center justify-center">
                    <CustomHashLoader showLoading={true} size={100} />
                </div>
            ) : state.error ? (
                <ErrorMessage message={state.error} />
            ) : (
                <>
                    <h4 className="mb-2 text-lg font-semibold">{i18n("exportSetlist:songs")}</h4>
                    <ul className="space-y-1">
                        {state.spotifySongs?.map((spotifySong, idx) =>
                            spotifySong?.name ? (
                                <SongListItem
                                    key={`${idx}-${spotifySong.name || "unknown"}`}
                                    spotifySong={spotifySong}
                                    idx={idx}
                                />
                            ) : (
                                !state.hideSongsNotFound && (
                                    <li key={`${idx}-${spotifySong?.name || "unknown"}`} className="py-2 text-red-500">
                                        <ErrorMessage
                                            message={`${i18n("exportSetlist:songNotFound")}: ${
                                                predictedSetlist
                                                    ? setlist?.predictedSongs?.[idx]?.name ||
                                                      i18n("exportSetlist:unknownSong")
                                                    : ((setlist?.sets?.set?.flatMap((set) => set.song) ?? [])[
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
