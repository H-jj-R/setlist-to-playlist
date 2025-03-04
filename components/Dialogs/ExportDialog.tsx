/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialog from "@components/Dialogs/MessageDialog";
import SetlistSongsExport from "@components/SearchAndExport/SetlistSongsExport";
import MessageDialogState from "@constants/messageDialogState";
import useExportDialogHook from "@hooks/useExportDialogHook";
import Image from "next/image";
import { useTranslation } from "react-i18next";

/**
 * Props for the `ExportDialog` component.
 *
 * @property {Record<string, any>} artistData - Data of the artist related to the setlist.
 * @property {boolean} isOpen - Flag indicating whether the export dialog is open.
 * @property {Function} onClose - Function to handle closing the dialog.
 * @property {boolean} [predictedSetlist] - Flag indicating whether the setlist is predicted.
 * @property {Record<string, any>} setlist - Data of the setlist to be exported.
 */
interface ExportDialogProps {
    artistData: Record<string, any>;
    isOpen: boolean;
    onClose: () => void;
    predictedSetlist?: boolean;
    setlist: Record<string, any>;
}

/**
 * **ExportDialog Component**
 *
 * Allows user to export chosen setlist to Spotify playlist with custom specifications.
 *
 * @param ExportDialogProps - Component props.
 *
 * @returns {JSX.Element} The rendered `ExportDialog` component.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({
    artistData,
    isOpen,
    onClose,
    predictedSetlist,
    setlist
}): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage export functionality and dialog state
    const { getInputProps, getRootProps, handleExport, resetState, setState, state } = useExportDialogHook(
        artistData,
        isOpen,
        onClose,
        predictedSetlist,
        setlist
    );

    return (
        isOpen && (
            <>
                <div
                    id="background-overlay"
                    className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    onClick={(): void => {
                        onClose();
                        resetState();
                    }}
                />
                <div
                    id="dialog-box"
                    className={`fixed inset-0 z-30 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                >
                    <div
                        id="export-dialog"
                        className="flex h-[30rem] w-full max-w-full flex-col gap-6 overflow-y-auto rounded-lg bg-white p-2 shadow-lg sm:w-11/12 md:w-3/4 md:flex-row lg:w-2/3 xl:w-1/2 dark:bg-gray-800"
                    >
                        <div id="export-dialog-main" className="flex-1 p-4">
                            <h3 id="export-dialog-title" className="mb-4 text-xl font-semibold">
                                {i18n("common:exportToSpotify")}
                            </h3>
                            <div id="playlist-name" className="mb-4">
                                <label
                                    id="playlist-name-label"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="playlist-name-input"
                                >
                                    {i18n("exportSetlist:playlistName")}{" "}
                                    <span id="required-asterisk" className="text-red-500">
                                        *
                                    </span>
                                </label>
                                <input
                                    id="playlist-name-input"
                                    className="mt-1 w-full rounded-lg border border-gray-900 bg-white p-2 dark:border-gray-300 dark:bg-black"
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
                            <div id="playlist-description" className="mb-4">
                                <label
                                    id="playlist-description-label"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    htmlFor="playlist-description-input"
                                >
                                    {i18n("exportSetlist:playlistDescription")}
                                </label>
                                <textarea
                                    id="playlist-description-input"
                                    className="mt-1 min-h-24 w-full resize-none overflow-auto rounded-lg border border-gray-900 bg-white p-2 dark:border-gray-300 dark:bg-black"
                                    autoComplete="off"
                                    maxLength={300}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
                                        setState((prev) => ({ ...prev, playlistDescription: e.target.value }));
                                    }}
                                    placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                    value={state.playlistDescription}
                                />
                            </div>
                            <div
                                id="playlist-cover-dropzone-container"
                                className="mb-4 flex flex-col items-start gap-4 md:flex-row"
                            >
                                <div id="playlist-cover-dropzone" className="max-h-40 flex-1 overflow-hidden">
                                    {state.imagePreview ? (
                                        <div id="playlist-cover-container" className="flex items-center">
                                            <Image
                                                id="img-preview"
                                                className="mr-2 h-24 w-24 rounded-lg object-cover"
                                                alt={i18n("exportSetlist:uploadedPlaylistCover")}
                                                height={700}
                                                src={state.imagePreview as string}
                                                width={700}
                                            />
                                            <button
                                                id="remove-img-btn"
                                                className="text-red-500 transition hover:cursor-pointer hover:text-red-700 focus:outline-hidden"
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
                            <div id="export-dialog-btns" className="mt-4 flex justify-end gap-4 pt-2">
                                <button
                                    id="cancel-btn"
                                    className="rounded-sm bg-red-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-red-600"
                                    onClick={(): void => {
                                        onClose();
                                        resetState();
                                    }}
                                >
                                    {i18n("common:cancel")}
                                </button>
                                <button
                                    id="export-btn"
                                    className="rounded-sm bg-green-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-green-600"
                                    onClick={handleExport}
                                >
                                    {i18n("common:export")}
                                </button>
                            </div>
                        </div>
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
                {!state.messageDialog.isOpen && (
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
