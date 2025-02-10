/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialog from "@components/Dialogs/MessageDialog";
import SetlistSongsExport from "@components/SearchAndExport/SetlistSongsExport";
import MessageDialogState from "@constants/messageDialogState";
import exportDialogHook from "@hooks/exportDialogHook";
import { useTranslation } from "react-i18next";

interface ExportDialogProps {
    artistData: Record<string, any>; // The data of the artist being exported
    isOpen: boolean; // Controls the visibility of the dialog
    onClose: () => void; // Close function
    predictedSetlist?: boolean; // Indicates if the setlist is AI-generated
    setlist: Record<string, any>; // The setlist data to be exported
}

/**
 * Dialog allowing user to export chosen setlist to playlist with custom specification.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({
    artistData,
    isOpen,
    onClose,
    predictedSetlist,
    setlist
}): JSX.Element => {
    const { t: i18n } = useTranslation();
    const { getInputProps, getRootProps, handleExport, resetState, setState, state } = exportDialogHook(
        artistData,
        isOpen,
        onClose,
        predictedSetlist,
        setlist
    );

    return (
        isOpen && (
            <>
                {/* Background Overlay */}
                <div
                    id="background-overlay"
                    className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    onClick={(): void => {
                        onClose();
                        resetState();
                    }}
                />

                {/* Dialog Box */}
                <div
                    id="dialog-box"
                    className={`fixed inset-0 z-30 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                >
                    <div
                        id="export-dialog"
                        className="flex h-[52vh] w-full max-w-full flex-col gap-6 overflow-y-auto rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800 sm:w-11/12 md:w-3/4 md:flex-row lg:w-2/3 xl:w-1/2"
                    >
                        {/* Main Export Dialog */}
                        <div id="export-dialog-main" className="flex-1 p-4">
                            <h3 id="export-dialog-title" className="mb-4 text-xl font-semibold">
                                {i18n("common:exportToSpotify")}
                            </h3>

                            {/* Playlist Name */}
                            <div id="playlist-name" className="mb-4">
                                <label
                                    id=""
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="playlist-name-input"
                                >
                                    {i18n("exportSetlist:playlistName")}
                                </label>
                                <input
                                    id="playlist-name-input"
                                    className="mt-1 w-full rounded-lg border p-2"
                                    autoComplete="off"
                                    maxLength={100}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                        setState((prev) => ({ ...prev, playlistName: e.target.value }));
                                    }}
                                    placeholder={i18n("exportSetlist:enterPlaylistName")}
                                    required
                                    type="text"
                                    value={state.playlistName}
                                />
                            </div>

                            {/* Playlist Description */}
                            <div id="playlist-description" className="mb-4">
                                <label
                                    id=""
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="playlist-description-input"
                                >
                                    {i18n("exportSetlist:playlistDescription")}
                                </label>
                                <textarea
                                    id="playlist-description-input"
                                    className="mt-1 min-h-24 w-full resize-none overflow-auto rounded-lg border p-2"
                                    autoComplete="off"
                                    maxLength={300}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                                        setState((prev) => ({ ...prev, playlistDescription: e.target.value }));
                                    }}
                                    placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                    value={state.playlistDescription}
                                />
                            </div>

                            {/* Playlist Cover Dropzone */}
                            <div
                                id="playlist-cover-container"
                                className="mb-4 flex flex-col items-start gap-4 md:flex-row"
                            >
                                <div id="playlist-cover" className="max-h-40 flex-1 overflow-hidden">
                                    {state.imagePreview ? (
                                        <div id="" className="flex items-center">
                                            <img
                                                id="image-preview"
                                                className="mr-2 h-24 w-24 rounded-lg object-cover"
                                                alt="Playlist Cover"
                                                src={state.imagePreview as string}
                                            />
                                            <button
                                                id="remove-image-btn"
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                                onClick={(): void => {
                                                    setState((prev) => ({ ...prev, image: null, imagePreview: null }));
                                                }}
                                                type="button"
                                            >
                                                {i18n("exportSetlist:removeImage")}
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            id="dropzone-container"
                                            {...getRootProps({
                                                className:
                                                    "border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer h-full flex flex-col justify-center overflow-hidden"
                                            })}
                                        >
                                            <input id="dropzone" {...getInputProps()} />
                                            <p id="dropzone-message" className="overflow-hidden text-sm">
                                                {i18n("exportSetlist:dropzoneMessage")}
                                            </p>
                                            <p id="dropzone-file-types" className="overflow-hidden text-sm">
                                                {i18n("exportSetlist:dropzoneFileTypes")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div id="export-dialog-btns" className="mt-4 flex justify-end gap-4 pt-2">
                                <button
                                    id="cancel-btn"
                                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                    onClick={(): void => {
                                        onClose();
                                        resetState();
                                    }}
                                >
                                    {i18n("common:cancel")}
                                </button>
                                <button
                                    id="export-btn"
                                    className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                    onClick={handleExport}
                                >
                                    {i18n("common:export")}
                                </button>
                            </div>
                        </div>

                        {/* Setlist Songs Component */}
                        <div
                            id="setlist-songs-wrapper"
                            className="flex h-full flex-1 flex-col items-center justify-center"
                        >
                            <SetlistSongsExport
                                artistData={artistData}
                                onSongsFetched={(songs: Record<string, any>[]): void =>
                                    setState((prev) => ({ ...prev, spotifySongs: songs }))
                                }
                                predictedSetlist={predictedSetlist}
                                setlist={setlist}
                            />
                        </div>
                    </div>
                </div>

                {/* Message Dialog */}
                {state.messageDialog.isOpen && (
                    <MessageDialog
                        message={state.messageDialog.message}
                        onClose={(): void => {
                            setState((prev) => ({
                                ...prev,
                                messageDialog: {
                                    isOpen: false,
                                    message: "",
                                    type: MessageDialogState.Success
                                }
                            }));
                            if (state.messageDialog.type === MessageDialogState.Success) {
                                onClose();
                                resetState();
                            }
                        }}
                        type={state.messageDialog.type}
                    />
                )}
            </>
        )
    );
};

export default ExportDialog;
