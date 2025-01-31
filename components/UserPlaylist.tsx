import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../components/ErrorMessage";
import { faChevronUp, faChevronDown, faEdit } from "@fortawesome/free-solid-svg-icons";
import CustomHashLoader from "./CustomHashLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UserPlaylistProps {
    playlist: any;
    onDelete: (playlistId: number) => void;
}

/**
 * Component to display and manage a user playlist.
 */
const UserPlaylist: React.FC<UserPlaylistProps> = ({ playlist, onDelete }) => {
    const { t: i18n } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(playlist.name);
    const [description, setDescription] = useState(playlist.description || "");
    const [tracks, setTracks] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleExpand = async () => {
        setExpanded(!expanded);
        if (!tracks && !loading) {
            fetchTrackDetails();
        }
    };

    const fetchTrackDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const trackIds = playlist.tracks.map((track: any) => track.songID).join(",");
            const response = await fetch(
                `/api/spotify/get-tracks?${new URLSearchParams({
                    query: trackIds
                }).toString()}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(data.error) || i18n("errors:unexpectedError")
                };
            }

            setTracks(data.tracks);
        } catch (err) {
            setError(err.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // TODO: Update on database
    };

    const handleRecover = async () => {
        // TODO: Recover on Spotify
    };

    const handleDelete = async () => {
        // TODO: Display confirmation dialog before proceeding.
        setLoading(true);
        setError(null);

        try {
            const token = localStorage?.getItem("authToken");
            if (!token) {
                return;
            }

            const response = await fetch(
                `/api/database/delete-user-playlist?${new URLSearchParams({
                    playlistId: playlist.playlistId
                }).toString()}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(data.error) || i18n("errors:unexpectedError")
                };
            }

            onDelete(playlist.playlistId);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <li className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 w-2/3">
                <div className="flex justify-between items-center">
                    {editing ? (
                        <div className="w-10/12">
                            <input
                                className="w-full p-2 border rounded-md mb-2"
                                value={name}
                                maxLength={100}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={i18n("exportSetlist:enterPlaylistName")}
                                required
                                autoComplete="off"
                            />
                            <textarea
                                className="w-full p-2 border rounded-md h-32"
                                value={description}
                                maxLength={300}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                autoComplete="off"
                            />
                            <div className="flex justify-center mt-2 space-x-2 p-2">
                                <button
                                    onClick={handleSave}
                                    className="w-32 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                                >
                                    {i18n("common:save")}
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="w-32 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                >
                                    {i18n("common:cancel")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-10/12 flex items-center">
                                <div className="w-full break-words">
                                    <h2 className="text-xl font-bold">{name}</h2>
                                    <p className="text-gray-400">{description}</p>
                                </div>
                            </div>

                            {/* Wrap edit button and recovery/delete buttons in a flex container */}
                            <div className="flex items-center space-x-4">
                                {/* Edit Button */}
                                <button onClick={() => setEditing(true)} className="text-gray-600 hover:text-gray-900">
                                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-white" />
                                </button>

                                {/* Recovery & Delete Buttons in a Column */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleRecover}
                                        className="w-32 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                                    >
                                        {i18n("userPlaylists:recover")}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-32 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                    >
                                        {i18n("common:delete")}
                                    </button>
                                </div>

                                {/* Expand/Collapse Button */}
                                <button onClick={toggleExpand} className="p-2">
                                    {expanded ? (
                                        <FontAwesomeIcon icon={faChevronUp} size="lg" className="text-white" />
                                    ) : (
                                        <FontAwesomeIcon icon={faChevronDown} size="lg" className="text-white" />
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {expanded && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                        {loading ? (
                            <div className="flex justify-center p-6">
                                <CustomHashLoader showLoading={true} size={80} />
                            </div>
                        ) : error ? (
                            <ErrorMessage message={error} />
                        ) : (
                            <ul className="space-y-2">
                                {tracks?.map((track, idx) => (
                                    <li key={`${idx}-${track.id}`} className="flex items-center space-x-4 mt-4">
                                        <img
                                            src={track.album.images[0]?.url}
                                            alt={track.name}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div>
                                            <p className="font-medium">{track.name}</p>
                                            <p className="text-sm text-gray-500">{track.artists[0]?.name}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </li>
        </>
    );
};

export default UserPlaylist;
