/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faEdit } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "@components/Dialogs/ConfirmationModal";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import MessageDialog from "@components/Dialogs/MessageDialog";
import SpotifyAuthDialog from "@components/Dialogs/SpotifyAuthDialog";
import { MessageDialogState } from "@constants/messageDialogState";
import userPlaylistHook from "@hooks/userPlaylistHook";

interface UserPlaylistProps {
    playlist: any;
    onDelete: (playlistId: number) => void;
}

/**
 * Component to display and manage a user playlist.
 */
const UserPlaylist: React.FC<UserPlaylistProps> = ({ playlist, onDelete }) => {
    const { t: i18n } = useTranslation();
    const { state, setState, toggleExpand, handleSave, handleRecover, handleDelete } = userPlaylistHook(
        playlist,
        onDelete
    );

    return (
        <>
            <li className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 w-2/3">
                <div className="flex justify-between items-center">
                    {!state.editing ? (
                        <>
                            <div className="w-10/12 flex items-center">
                                <div className="w-full break-words">
                                    <h2 className="text-xl font-bold">{state.name}</h2>
                                    <p className="text-gray-400">{state.description}</p>
                                </div>
                            </div>

                            {/* Wrap edit button and recovery/delete buttons in a flex container */}
                            <div className="flex items-center space-x-4">
                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        setState((prev) => ({
                                            ...prev,
                                            editing: true
                                        }));
                                    }}
                                    className="text-gray-600 hover:text-gray-900 p-1"
                                >
                                    <FontAwesomeIcon icon={faEdit} size="lg" className="text-white" />
                                </button>

                                {/* Recovery & Delete Buttons */}
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleRecover}
                                        className="w-32 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
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
                                        className="w-32 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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
                                className="w-full p-2 border rounded-md mb-2"
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
                                className="w-full p-2 border rounded-md h-32"
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
                            <div className="flex justify-center mt-2 space-x-2 p-2">
                                <button
                                    onClick={handleSave}
                                    className="w-32 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
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
                                    className="w-32 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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

            {/* Spotify Authorisation dialog */}
            {state.showAuthDialog && (
                <SpotifyAuthDialog
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            showAuthDialog: false
                        }));
                    }}
                ></SpotifyAuthDialog>
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
                ></ConfirmationModal>
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
                ></MessageDialog>
            )}
        </>
    );
};

export default UserPlaylist;
