import React, { useEffect, useState } from "react";
import CustomHashLoader from "./CustomHashLoader";
import ErrorMessage from "./ErrorMessage";

interface SetlistSongsExportProps {
    setlist: Record<string, any>; // The setlist data
    artistData: Record<string, any>; // Artist information
}

const SetlistSongsExport: React.FC<SetlistSongsExportProps> = ({ setlist, artistData }) => {
    const [spotifySongs, setSpotifySongs] = useState<Record<string, any>[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpotifySongs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `/api/controllers/get-spotify-songs?artist=${artistData.spotifyArtist.name}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ setlist })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch Spotify song details");
                }

                const data = await response.json();
                setSpotifySongs(data);
            } catch (err) {
                console.error("Error fetching Spotify songs:", err);
                setError("Failed to load songs. Error: " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpotifySongs();
    }, [setlist, artistData.spotifyArtist.name]);

    const SongListItem = ({ spotifySong }: { spotifySong: any }) => (
        <li className="py-2">
            <div className="flex items-center space-x-4">
                {spotifySong?.album?.images[0]?.url && (
                    <img
                        src={spotifySong.album.images[0].url}
                        alt={`${spotifySong.name} cover`}
                        className="w-12 h-12 rounded shadow"
                    />
                )}
                <div>
                    <p className="font-medium">{spotifySong?.name}</p>
                    <p className="text-sm text-gray-500">{spotifySong?.artists?.[0]?.name}</p>
                </div>
            </div>
        </li>
    );

    return (
        <div className="flex flex-col bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-md max-w-sm w-full overflow-y-auto">
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
                        {setlist.sets.set.flatMap((set: any, setIdx: number) =>
                            set.song.flatMap((song: any, songIdx: number) => {
                                const spotifySong = spotifySongs?.[setIdx * set.song.length + songIdx] || null;
                                if (!spotifySong?.name) return null; // Exclude the song if spotifySong is null
                                return (
                                    <SongListItem
                                        key={`${setIdx}-${songIdx}-${song.name || "unknown"}`}
                                        spotifySong={spotifySong}
                                    />
                                );
                            })
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SetlistSongsExport;
