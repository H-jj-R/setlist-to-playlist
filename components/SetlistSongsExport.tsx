import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomHashLoader from "@components/CustomHashLoader";
import ErrorMessage from "@components/ErrorMessage";

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
    const [settingsStates, setSettingsStates] = useState({
        hideSongsNotFound: localStorage?.getItem("hideSongsNotFound") === "true",
        excludeCovers: localStorage?.getItem("excludeCovers") === "true",
        excludeDuplicateSongs: localStorage?.getItem("excludeDuplicateSongs") === "true"
    });

    useEffect(() => {
        const handleHideSongsNotFoundChange = () => {
            setSettingsStates((prev) => ({
                ...prev,
                hideSongsNotFound: localStorage?.getItem("hideSongsNotFound") === "true"
            }));
        };
        const handleExcludeCoversChange = () => {
            setSettingsStates((prev) => ({
                ...prev,
                excludeCovers: localStorage?.getItem("excludeCovers") === "true"
            }));
        };
        const handleExcludeDuplicateSongs = () => {
            setSettingsStates((prev) => ({
                ...prev,
                excludeDuplicateSongs: localStorage?.getItem("excludeDuplicateSongs") === "true"
            }));
        };

        window.addEventListener("hideSongsNotFound", handleHideSongsNotFoundChange);
        window.addEventListener("excludeCovers", handleExcludeCoversChange);
        window.addEventListener("excludeDuplicateSongs", handleExcludeDuplicateSongs);
        return () => {
            window.removeEventListener("hideSongsNotFound", handleHideSongsNotFoundChange);
            window.removeEventListener("excludeCovers", handleExcludeCoversChange);
            window.removeEventListener("excludeDuplicateSongs", handleExcludeDuplicateSongs);
        };
    }, []);

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
                        error: i18n(responseJson.error) || i18n("errors:unexpectedError")
                    };
                }

                setSpotifySongs(responseJson);

                if (settingsStates.excludeCovers) {
                    responseJson.forEach((song: any, idx: number) => {
                        if (song.artists?.[0]?.name !== artistData.spotifyArtist.name) {
                            toggleExcludeSong(song.id, idx);
                        }
                    });
                }

                if (settingsStates.excludeDuplicateSongs) {
                    const seenSongs = new Set();
                    responseJson.forEach((song: any, idx: number) => {
                        if (seenSongs.has(song.id)) {
                            toggleExcludeSong(song.id, idx);
                        } else {
                            seenSongs.add(song.id);
                        }
                    });
                }
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [setlist, artistData.spotifyArtist.name]);

    useEffect(() => {
        if (spotifySongs) {
            onSongsFetched(spotifySongs.filter((song, idx) => !excludedSongs.has(`${song.id}-${idx}`)));
        }
    }, [spotifySongs, excludedSongs]);

    const toggleExcludeSong = (songId: string, songIndex: number) => {
        setExcludedSongs((prev) => {
            const newExcludedSongs = new Set(prev);
            const songKey = `${songId}-${songIndex}`;
            if (newExcludedSongs.has(songKey)) {
                newExcludedSongs.delete(songKey);
            } else {
                newExcludedSongs.add(songKey);
            }
            return newExcludedSongs;
        });
    };

    const SongListItem = ({ spotifySong, idx }: { spotifySong: any; idx: number }) => (
        <li
            id={`song-item-${spotifySong?.id}`}
            className={`py-2 cursor-pointer ${excludedSongs.has(`${spotifySong?.id}-${idx}`) ? "opacity-20" : ""}`}
            onClick={() => toggleExcludeSong(spotifySong.id, idx)}
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
                                    idx={idx}
                                />
                            ) : (
                                !settingsStates.hideSongsNotFound && (
                                    <li key={`${idx}-${spotifySong?.name || "unknown"}`} className="py-2 text-red-500">
                                        <ErrorMessage
                                            message={`${i18n("exportSetlist:songNotFound")}: ${
                                                predictedSetlist
                                                    ? setlist?.predictedSongs?.[idx]?.name ||
                                                      i18n("exportSetlist:unknownSong")
                                                    : (setlist?.sets?.set.flatMap((set) => set.song) || [])[idx]
                                                          ?.name || i18n("exportSetlist:unknownSong")
                                            }`}
                                            small={true}
                                        ></ErrorMessage>
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
