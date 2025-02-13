/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import setlistSongsExportHook from "@hooks/setlistSongsExportHook";
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
}): JSX.Element => {
    const { t: i18n } = useTranslation();
    const { state, toggleExcludeSong } = setlistSongsExportHook(artistData, onSongsFetched, setlist, predictedSetlist);

    const SongListItem = ({ idx, spotifySong }: { idx: number; spotifySong: any }): JSX.Element => (
        <li
            id={`song-item-${spotifySong?.id}`}
            className={`cursor-pointer py-2 ${
                state.excludedSongs.has(`${spotifySong?.id}-${idx}`) ? "opacity-20" : ""
            }`}
            onClick={(): void => toggleExcludeSong(spotifySong.id, idx)}
        >
            <div id="song-details-container" className="flex items-center space-x-4">
                {spotifySong?.album?.images[0]?.url && (
                    <img
                        id="song-cover-img"
                        className="h-12 w-12 rounded shadow"
                        alt={`${spotifySong.name} ${i18n("setlistSearch:image")}`}
                        src={spotifySong.album.images[0].url}
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
                                    <SongListItem
                                        idx={idx}
                                        key={`${idx}-${spotifySong.name || "unknown"}`}
                                        spotifySong={spotifySong}
                                    />
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
