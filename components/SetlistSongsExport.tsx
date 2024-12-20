import React, { useEffect, useState } from "react";
import CustomHashLoader from "./CustomHashLoader";
import ErrorMessage from "./ErrorMessage";

interface SetlistSongsExportProps {
    setlist: Record<string, any>; // The setlist data
    artistData: Record<string, any>; // Artist information
    onSongsFetched: (songs: Record<string, any>[]) => void; // Callback to pass songs to ExportDialog
}

/**
 * Displays setlist songs as from Spotify as they will be exported.
 */
const SetlistSongsExport: React.FC<SetlistSongsExportProps> = ({ setlist, artistData, onSongsFetched }) => {
    const [spotifySongs, setSpotifySongs] = useState<Record<string, any>[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/controllers/get-spotify-songs?${new URLSearchParams({
                        artist: artistData.spotifyArtist.name
                    }).toString()}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ setlist })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch Spotify song details");
                }

                setSpotifySongs(await response.json());
            } catch (err) {
                console.error("Error fetching Spotify songs:", err);
                setError("Failed to load songs. Error: " + err);
            } finally {
                setLoading(false);
            }
        })();
    }, [setlist, artistData.spotifyArtist.name]);

    useEffect(() => {
        if (spotifySongs) {
            onSongsFetched(spotifySongs);
        }
    }, [spotifySongs]);

    const SongListItem = ({ spotifySong }: { spotifySong: any }) => (
        <li id={`song-item-${spotifySong?.id}`} className="py-2">
            <div className="flex items-center space-x-4">
                {spotifySong?.album?.images[0]?.url && (
                    <img
                        id={`song-cover-${spotifySong?.id}`}
                        src={spotifySong.album.images[0].url}
                        alt={`${spotifySong.name} cover`}
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
        <div className="flex flex-col bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md w-full max-w-sm overflow-y-auto">
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <CustomHashLoader showLoading={true} size={100} />
                </div>
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <>
                    <h4 className="text-lg font-semibold mb-2">Songs</h4>
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
                                        message={`Song not found: ${
                                            (setlist?.sets?.set.flatMap((set) => set.song) || [])[idx]?.name ||
                                            "Unknown Song"
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
