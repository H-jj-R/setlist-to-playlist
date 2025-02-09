/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import ConfirmationModal from "@components/Dialogs/ConfirmationModal";
import MessageDialog from "@components/Dialogs/MessageDialog";
import SpotifyAuthDialog from "@components/Dialogs/SpotifyAuthDialog";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import MessageDialogState from "@constants/messageDialogState";
import { faChevronDown, faChevronUp, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userPlaylistHook from "@hooks/userPlaylistHook";
import React from "react";
import { useTranslation } from "react-i18next";

interface UserPlaylistProps {
    onDelete: (playlistId: number) => void;
    playlist: any;
}

/**
 * Component to display and manage a user playlist.
 */
const UserPlaylist: React.FC<UserPlaylistProps> = ({ onDelete, playlist }) => {
    const { t: i18n } = useTranslation();
    const { state, setState, toggleExpand, handleSave, handleRecover, handleDelete } = userPlaylistHook(
        playlist,
        onDelete
    );

    return (
        <>
            <li id="user-playlist-item" className="w-2/3 rounded-lg border bg-white p-4 shadow-md dark:bg-gray-800">
                <div id="user-playlist-container" className="flex items-center justify-between">
                    {!state.editing ? (
                        <>
                            <div className="flex w-10/12 items-center">
                                <div className="w-full break-words">
                                    <h2 className="text-xl font-bold">{state.name}</h2>
                                    <p className="text-gray-400">{state.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        setState((prev) => ({
                                            ...prev,
                                            editing: true
                                        }));
                                    }}
                                    className="p-1 text-gray-600 hover:text-gray-900"
                                >
                                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-white" />
                                </button>

                                {/* Recovery & Delete Buttons */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleRecover}
                                        className="w-32 rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                                    >
                                        {i18n("userPlaylists:recover")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev,
                                                showConfirmation: true
                                            }));
                                        }}
                                        className="w-32 rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                                    >
                                        {i18n("common:delete")}
                                    </button>
                                </div>

                                {/* Expand/Collapse Button */}
                                <button onClick={toggleExpand} className="p-1">
                                    {state.expanded ? (
                                        <FontAwesomeIcon icon={faChevronUp} size="lg" className="text-white" />
                                    ) : (
                                        <FontAwesomeIcon icon={faChevronDown} size="lg" className="text-white" />
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-10/12">
                            <input
                                className="mb-2 w-full rounded-md border p-2"
                                value={state.name}
                                maxLength={100}
                                onChange={(e) => {
                                    setState((prev) => ({
                                        ...prev,
                                        name: e.target.value
                                    }));
                                }}
                                placeholder={i18n("exportSetlist:enterPlaylistName")}
                                required
                                autoComplete="off"
                            />
                            <textarea
                                className="h-32 w-full rounded-md border p-2"
                                value={state.description}
                                maxLength={300}
                                onChange={(e) => {
                                    setState((prev) => ({
                                        ...prev,
                                        description: e.target.value
                                    }));
                                }}
                                placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                autoComplete="off"
                            />
                            <div className="mt-2 flex justify-center space-x-2 p-2">
                                <button
                                    onClick={handleSave}
                                    className="w-32 rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                                >
                                    {i18n("common:save")}
                                </button>
                                <button
                                    onClick={() => {
                                        setState((prev) => ({
                                            ...prev,
                                            editing: false,
                                            name: state.initialName,
                                            description: state.initialDescription
                                        }));
                                    }}
                                    className="w-32 rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                                >
                                    {i18n("common:cancel")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {state.expanded && (
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700">
                        {state.songsLoading ? (
                            <div className="flex justify-center p-6">
                                <CustomHashLoader showLoading={true} size={80} />
                            </div>
                        ) : state.songError ? (
                            <ErrorMessage message={state.songError} />
                        ) : (
                            <ul className="space-y-2">
                                {state.tracks?.map((track, idx) => (
                                    <li key={`${idx}-${track.id}`} className="mt-4 flex items-center space-x-4">
                                        <img
                                            src={track.album.images[0]?.url}
                                            alt={track.name}
                                            className="h-12 w-12 rounded"
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

            {/* Spotify Authorisation dialog */}
            {state.showAuthDialog && (
                <SpotifyAuthDialog
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            showAuthDialog: false
                        }));
                    }}
                />
            )}

            {/* Confirmation Modal */}
            {state.showConfirmation && (
                <ConfirmationModal
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setState((prev) => ({
                            ...prev,
                            showConfirmation: false
                        }));
                    }}
                />
            )}

            {/* Message Dialog */}
            {state.messageDialog.isOpen && (
                <MessageDialog
                    message={state.messageDialog.message}
                    type={state.messageDialog.type}
                    onClose={() => {
                        state.messageDialog.onClose === null
                            ? setState((prev) => ({
                                  ...prev,
                                  messageDialog: {
                                      isOpen: false,
                                      message: "",
                                      type: MessageDialogState.Success,
                                      onClose: null
                                  }
                              }))
                            : state.messageDialog.onClose();
                    }}
                />
            )}
        </>
    );
};

export default UserPlaylist;
