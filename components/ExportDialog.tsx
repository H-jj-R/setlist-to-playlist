import React from "react";
import { useTranslation } from "react-i18next";
import SetlistSongsExport from "./SetlistSongsExport";
import exportDialogHook from "../lib/hooks/exportDialogHook";
import MessageDialog from "./MessageDialog";

interface ExportDialogProps {
    setlist: Record<string, any>; // The setlist data to be exported
    artistData: Record<string, any>;
    isOpen: boolean; // Controls the visibility of the dialog
    predictedSetlist?: boolean; // Indicates if the setlist is AI-generated
    onClose: () => void; // Close function
}

/**
 * Dialog allowing user to export chosen setlist to playlist with custom specification.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({ setlist, artistData, isOpen, predictedSetlist, onClose }) => {
    const { t: i18n } = useTranslation();
    const { state, messageDialog, setMessageDialog, setState, getRootProps, getInputProps, handleExport, resetState } =
        exportDialogHook({ setlist, artistData, isOpen, predictedSetlist, onClose });

    return (
        isOpen && (
            <>
                {/* Background Overlay */}
                <div
                    id="background-overlay"
                    className={`z-20 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => {
                        onClose();
                        resetState();
                    }}
                ></div>

                {/* Dialog Box */}
                <div
                    id="dialog-box"
                    className={`z-30 fixed inset-0 flex justify-center items-center transition-all duration-500 ease-in-out ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                    }`}
                >
                    <div
                        id="export-dialog"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-full flex flex-col md:flex-row gap-6 h-[52vh] overflow-y-auto"
                    >
                        {/* Main Export Dialog */}
                        <div id="export-dialog-main" className="flex-1 p-4">
                            <h3 id="export-dialog-title" className="text-xl font-semibold mb-4">
                                {i18n("common:exportToSpotify")}
                            </h3>

                            {/* Playlist Name */}
                            <div id="playlist-name" className="mb-4">
                                <label
                                    htmlFor="playlist-name-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {i18n("exportSetlist:playlistName")}
                                </label>
                                <input
                                    id="playlist-name-input"
                                    type="text"
                                    maxLength={100}
                                    className="mt-1 p-2 w-full border rounded-lg"
                                    value={state.playlistName}
                                    onChange={(e) => {
                                        setState((prev) => ({
                                            ...prev,
                                            playlistName: e.target.value
                                        }));
                                    }}
                                    placeholder={i18n("exportSetlist:enterPlaylistName")}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            {/* Playlist Description */}
                            <div id="playlist-description" className="mb-4">
                                <label
                                    htmlFor="playlist-description-input"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    {i18n("exportSetlist:playlistDescription")}
                                </label>
                                <textarea
                                    id="playlist-description-input"
                                    className="mt-1 p-2 w-full min-h-24 border rounded-lg overflow-auto resize-none"
                                    maxLength={300}
                                    value={state.playlistDescription}
                                    onChange={(e) => {
                                        setState((prev) => ({
                                            ...prev,
                                            playlistDescription: e.target.value
                                        }));
                                    }}
                                    placeholder={i18n("exportSetlist:enterPlaylistDescription")}
                                    autoComplete="off"
                                />
                            </div>

                            <div
                                id="playlist-cover-container"
                                className="flex flex-col md:flex-row items-start gap-4 mb-4"
                            >
                                {/* Playlist Cover Dropzone */}
                                <div id="playlist-cover" className="flex-1 max-h-40 overflow-hidden">
                                    {state.imagePreview ? (
                                        <div className="flex items-center">
                                            <img
                                                id="image-preview"
                                                src={state.imagePreview}
                                                alt="Playlist Cover"
                                                className="w-24 h-24 object-cover rounded-lg mr-2"
                                            />
                                            <button
                                                id="remove-image-button"
                                                type="button"
                                                onClick={() => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        image: null,
                                                        imagePreview: null
                                                    }));
                                                }}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                {i18n("exportSetlist:removeImage")}
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            id="dropzone"
                                            {...getRootProps({
                                                className:
                                                    "border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer h-full flex flex-col justify-center overflow-hidden"
                                            })}
                                        >
                                            <input {...getInputProps()} />
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
                            <div id="export-dialog-buttons" className="mt-4 pt-2 flex justify-end gap-4">
                                <button
                                    id="cancel-button"
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => {
                                        onClose();
                                        resetState();
                                    }}
                                >
                                    {i18n("common:cancel")}
                                </button>
                                <button
                                    id="export-button"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={handleExport}
                                >
                                    {i18n("common:export")}
                                </button>
                            </div>
                        </div>

                        {/* Setlist Songs Component */}
                        <div id="setlist-songs-wrapper" className="flex-1 flex flex-col justify-center items-center">
                            <SetlistSongsExport
                                setlist={setlist}
                                artistData={artistData}
                                predictedSetlist={predictedSetlist}
                                onSongsFetched={(songs) =>
                                    setState((prev) => ({
                                        ...prev,
                                        spotifySongs: songs
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Message Dialog */}
                <MessageDialog
                    isOpen={messageDialog.isOpen}
                    message={messageDialog.message}
                    type={messageDialog.type as "success" | "error"}
                    onClose={() => {
                        setMessageDialog({ isOpen: false, message: "", type: "success" });
                        if (messageDialog.type === "success") {
                            onClose();
                            resetState();
                        }
                    }}
                />
            </>
        )
    );
};

export default ExportDialog;
