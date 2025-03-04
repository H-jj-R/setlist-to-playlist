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
import useUserPlaylistHook from "@hooks/useUserPlaylistHook";
import Image from "next/image";
import { useTranslation } from "react-i18next";

/**
 * Props for the `UserPlaylist` component.
 *
 * @property {Function} onDelete - Function to handle playlist deletion.
 * @property {Record<string, any>} playlist - Playlist data object.
 */
interface UserPlaylistProps {
    onDelete: (playlistId: number) => void;
    playlist: Record<string, any>;
}

/**
 * **UserPlaylist Component**
 *
 * Displays a user-created playlist's full details and contents.
 *
 * @param UserPlaylistProps - Component props.
 *
 * @returns {JSX.Element} The rendered `UserPlaylist` component.
 */
const UserPlaylist: React.FC<UserPlaylistProps> = ({ onDelete, playlist }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage user playlist actions and state
    const { handleDelete, handleRecover, handleSave, setState, state, toggleExpand } = useUserPlaylistHook(
        onDelete,
        playlist
    );

    return (
        <>
            <li id="user-playlist-item" className="w-2/3 rounded-lg border bg-white p-4 shadow-md dark:bg-gray-800">
                <div id="user-playlist-container" className="flex items-center justify-between">
                    {!state.editing ? (
                        <>
                            <div id="user-playlist-details-container" className="flex w-10/12 items-center">
                                <div id="user-playlist-details" className="w-full break-words">
                                    <h2 id="user-playlist-name" className="text-xl font-bold">
                                        {state.name}
                                    </h2>
                                    <p id="user-playlist-description" className="text-gray-400">
                                        {state.description}
                                    </p>
                                </div>
                            </div>
                            <div id="edit-btn-container" className="flex items-center space-x-4">
                                <button
                                    id="edit-btn"
                                    className="p-1 text-gray-600 transition hover:cursor-pointer hover:text-gray-900"
                                    aria-label={i18n("common:edit")}
                                    onClick={(): void => {
                                        setState((prev) => ({ ...prev, editing: true }));
                                    }}
                                >
                                    <FontAwesomeIcon id="fa-edit-icon" className="text-white" icon={faEdit} size="lg" />
                                </button>
                                <div id="recovery-delete-btns-container" className="flex flex-col items-center gap-2">
                                    <button
                                        id="recovery-btn"
                                        className="w-32 rounded-sm bg-green-500 px-6 py-2 text-white transition hover:cursor-pointer hover:bg-green-600"
                                        onClick={handleRecover}
                                    >
                                        {i18n("userPlaylists:recover")}
                                    </button>
                                    <button
                                        id="delete-btn"
                                        className="w-32 rounded-sm bg-red-500 px-6 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
                                        onClick={(): void => {
                                            setState((prev) => ({ ...prev, showConfirmation: true }));
                                        }}
                                    >
                                        {i18n("common:delete")}
                                    </button>
                                </div>
                                <button
                                    id="expand-collapse-btns-container"
                                    className="p-1 transition hover:cursor-pointer"
                                    aria-expanded={state.expanded}
                                    aria-label={
                                        state.expanded
                                            ? i18n("userPlaylists:collapseContents")
                                            : i18n("userPlaylists:expandContents")
                                    }
                                    onClick={toggleExpand}
                                >
                                    {state.expanded ? (
                                        <FontAwesomeIcon
                                            id="fa-chevron-up-icon"
                                            className="text-white"
                                            icon={faChevronUp}
                                            size="lg"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            id="fa-chevron-down-icon"
                                            className="text-white"
                                            icon={faChevronDown}
                                            size="lg"
                                        />
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div id="user-playlist-edit-container" className="w-10/12">
                            <label id="sr-playlist-name-input" className="sr-only" htmlFor="playlist-name-input">
                                {i18n("exportSetlist:enterPlaylistName")}
                            </label>
                            <input
                                id="playlist-name-input"
                                className="mb-2 w-full rounded-md border border-gray-900 bg-white p-2 dark:border-gray-300 dark:bg-black"
                                autoComplete="off"
                                maxLength={100}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                    setState((prev) => ({ ...prev, name: e.target.value }));
                                }}
                                placeholder={i18n("exportSetlist:enterPlaylistName")}
                                required
                                value={state.name}
                            />
                            <textarea
                                id="playlist-description-input"
                                className="h-32 w-full rounded-md border border-gray-900 bg-white p-2 dark:border-gray-300 dark:bg-black"
                                aria-live="polite"
                                autoComplete="off"
                                maxLength={300}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                                    setState((prev) => ({ ...prev, description: e.target.value }));
                                }}
                                placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                value={state.description}
                            />
                            <div id="save-cancel-btns-container" className="mt-2 flex justify-center space-x-2 p-2">
                                <button
                                    id="save-btn"
                                    className="w-32 rounded-sm bg-green-500 px-6 py-2 text-white transition hover:cursor-pointer hover:bg-green-600"
                                    aria-controls="user-playlist-edit-container"
                                    aria-label={i18n("userPlaylists:savePlaylistChanges")}
                                    onClick={handleSave}
                                >
                                    {i18n("common:save")}
                                </button>
                                <button
                                    id="cancel-btn"
                                    className="w-32 rounded-sm bg-red-500 px-6 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
                                    aria-controls="user-playlist-edit-container"
                                    aria-label={i18n("userPlaylists:cancelDiscardChanges")}
                                    onClick={(): void => {
                                        setState((prev) => ({
                                            ...prev,
                                            description: state.initialDescription,
                                            editing: false,
                                            name: state.initialName
                                        }));
                                    }}
                                >
                                    {i18n("common:cancel")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {state.expanded && (
                    <div
                        id="user-playlist-contents-container"
                        className="mt-4 border-t border-gray-200 dark:border-gray-700"
                        aria-expanded={state.expanded}
                        aria-labelledby="sr-playlist-contents-title"
                        role="region"
                    >
                        <span id="sr-playlist-contents-title" className="sr-only">
                            {i18n("userPlaylists:playlistContents")}
                        </span>
                        {state.songsLoading ? (
                            <div
                                id="loader-container"
                                className="flex justify-center p-6"
                                aria-busy="true"
                                aria-live="polite"
                                role="status"
                            >
                                <CustomHashLoader showLoading={true} size={80} />
                            </div>
                        ) : state.songError ? (
                            <div id="error-message-container" role="alert">
                                <ErrorMessage message={state.songError} />
                            </div>
                        ) : (
                            <ul
                                id="user-playlist-tracks"
                                className="space-y-2"
                                aria-labelledby="sr-playlist-contents-title"
                                role="list"
                            >
                                {state.tracks?.map(
                                    (track: Record<string, any>, idx: number): JSX.Element => (
                                        <li
                                            id={`track-${idx}-${track.id}`}
                                            className="mt-4 flex items-center space-x-4"
                                            aria-describedby={`track-artist-${idx}`}
                                            aria-labelledby={`track-name-${idx}`}
                                            key={`${idx}-${track.id}`}
                                            role="listitem"
                                        >
                                            <Image
                                                id="track-img"
                                                className="h-12 w-12 rounded-sm"
                                                alt={
                                                    track.name
                                                        ? `${track.name} ${i18n("common:image")}`
                                                        : i18n("common:songCoverArt")
                                                }
                                                height={700}
                                                src={track.album.images[0]?.url || "/images/song-placeholder.jpg"}
                                                width={700}
                                            />
                                            <div>
                                                <p id="track-name" className="font-medium">
                                                    {track.name}
                                                </p>
                                                <p id="track-artist" className="text-sm text-gray-500">
                                                    {track.artists[0]?.name}
                                                </p>
                                            </div>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                )}
            </li>
            {state.showAuthDialog && (
                <SpotifyAuthDialog
                    onClose={(): void => {
                        setState((prev) => ({ ...prev, showAuthDialog: false }));
                    }}
                />
            )}
            {state.showConfirmation && (
                <ConfirmationModal
                    onCancel={(): void => {
                        setState((prev) => ({ ...prev, showConfirmation: false }));
                    }}
                    onConfirm={handleDelete}
                />
            )}
            {state.messageDialog.isOpen && (
                <MessageDialog
                    message={state.messageDialog.message}
                    onClose={(): void => {
                        state.messageDialog.onClose === null
                            ? setState((prev) => ({
                                  ...prev,
                                  messageDialog: {
                                      isOpen: false,
                                      message: "",
                                      onClose: null,
                                      type: MessageDialogState.Success
                                  }
                              }))
                            : state.messageDialog.onClose();
                    }}
                    type={state.messageDialog.type}
                />
            )}
        </>
    );
};

export default UserPlaylist;
