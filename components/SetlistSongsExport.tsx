import React, { useEffect, useState } from "react";
import CustomHashLoader from "./CustomHashLoader";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";

interface SetlistSongsExportProps {
    setlist: Record<string, any>; // The setlist data
    artistData: Record<string, any>; // Artist information
    predictedSetlist?: boolean; // Whether the setlist is predicted
    onSongsFetched: (songs: Record<string, any>[]) => void; // Callback to pass songs to ExportDialog
}

/**
 * Displays setlist songs as from Spotify as they will be exported.
 */
const SetlistSongsExport: React.FC<SetlistSongsExportProps> = ({
    setlist,
    artistData,
    predictedSetlist,
    onSongsFetched
}) => {
    const { t: i18n } = useTranslation();
    const [spotifySongs, setSpotifySongs] = useState<Record<string, any>[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [excludedSongs, setExcludedSongs] = useState<Set<string>>(new Set());

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/controllers/get-spotify-songs?${new URLSearchParams({
                        artist: artistData.spotifyArtist.name,
                        isPredicted: predictedSetlist ? "true" : "false"
                    }).toString()}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ setlist })
                    }
                );
                const responseJson = await response.json();
                if (!response.ok) {
                    throw {
                        status: response.status,
                        error: responseJson.error || i18n("errors:unexpectedError")
                    };
                }

                setSpotifySongs(responseJson);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [setlist, artistData.spotifyArtist.name]);

    useEffect(() => {
        if (spotifySongs) {
            onSongsFetched(spotifySongs.filter((song) => !excludedSongs.has(song.id)));
        }
    }, [spotifySongs, excludedSongs]);

    const toggleExcludeSong = (songId: string) => {
        setExcludedSongs((prev) => {
            const newExcludedSongs = new Set(prev);
            if (newExcludedSongs.has(songId)) {
                newExcludedSongs.delete(songId);
            } else {
                newExcludedSongs.add(songId);
            }
            return newExcludedSongs;
        });
    };

    const SongListItem = ({ spotifySong }: { spotifySong: any }) => (
        <li
            id={`song-item-${spotifySong?.id}`}
            className={`py-2 cursor-pointer ${excludedSongs.has(spotifySong.id) ? "opacity-20" : ""}`}
            onClick={() => toggleExcludeSong(spotifySong.id)}
        >
            <div className="flex items-center space-x-4">
                {spotifySong?.album?.images[0]?.url && (
                    <img
                        id={`song-cover-${spotifySong?.id}`}
                        src={spotifySong.album.images[0].url}
                        alt={`${spotifySong.name} ${i18n("setlistSearch:image")}`}
                        className="w-12 h-12 rounded shadow"
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
        <div className="flex flex-col bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md w-full h-full overflow-y-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <CustomHashLoader showLoading={true} size={100} />
                </div>
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <>
                    <h4 className="text-lg font-semibold mb-2">{i18n("exportSetlist:songs")}</h4>
                    <ul className="space-y-1">
                        {spotifySongs?.map((spotifySong, idx) =>
                            spotifySong?.name ? (
                                <SongListItem
                                    key={`${idx}-${spotifySong.name || "unknown"}`}
                                    spotifySong={spotifySong}
                                />
                            ) : (
                                <li key={`${idx}-${spotifySong?.name || "unknown"}`} className="py-2 text-red-500">
                                    <ErrorMessage
                                        message={`${i18n("exportSetlist:songNotFound")}: ${
                                            predictedSetlist
                                                ? setlist?.predictedSongs?.[idx]?.name ||
                                                  i18n("exportSetlist:unknownSong")
                                                : (setlist?.sets?.set.flatMap((set) => set.song) || [])[idx]?.name ||
                                                  i18n("exportSetlist:unknownSong")
                                        }`}
                                        small={true}
                                    ></ErrorMessage>
                                </li>
                            )
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SetlistSongsExport;
