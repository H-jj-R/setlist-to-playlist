import React from "react";
import SetlistSongsExport from "./SetlistSongsExport";
import exportDialogHook from "../lib/hooks/exportDialogHook";

interface ExportDialogProps {
    setlist: Record<string, any>; // The setlist data to be exported
    artistData: Record<string, any>;
    isOpen: boolean; // Controls the visibility of the dialog
    onClose: () => void; // Close function
}

/**
 * Dialog allowing user to export chosen setlist to playlist with custom specification.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({ setlist, artistData, isOpen, onClose }) => {
    const { state, i18nCommon, i18n, setState, getRootProps, getInputProps, handleExport, resetState } =
        exportDialogHook({ setlist, artistData, isOpen, onClose });

    //TODO: Export dialog doesn't currently account for no query (when just setlist)
    return (
        isOpen && (
            <>
                {/* Background Overlay */}
                <div
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
                    className={`z-30 fixed inset-0 flex justify-center items-center transition-all duration-500 ease-in-out ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                    }`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-full flex flex-col md:flex-row gap-6 h-[59vh] overflow-y-auto">
                        {/* Main Export Dialog */}
                        <div className="flex-1 p-4">
                            <h3 className="text-xl font-semibold mb-4">{i18n("exportToSpotify")}</h3>

                            {/* Playlist Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {i18n("playlistName")}
                                </label>
                                <input
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
                                    placeholder={i18n("enterPlaylistName")}
                                    required
                                />
                            </div>

                            {/* Playlist Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {i18n("playlistDescription")}
                                </label>
                                <textarea
                                    className="mt-1 p-2 w-full min-h-24 border rounded-lg overflow-auto resize-none"
                                    maxLength={300}
                                    value={state.playlistDescription}
                                    onChange={(e) => {
                                        setState((prev) => ({
                                            ...prev,
                                            playlistDescription: e.target.value
                                        }));
                                    }}
                                    placeholder={i18n("enterPlaylistDescription")}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
                                {/* Playlist Cover Dropzone */}
                                <div className="flex-1 max-h-40 overflow-hidden">
                                    {state.imagePreview ? (
                                        <div className="flex items-center">
                                            <img
                                                src={state.imagePreview}
                                                alt="Playlist Cover"
                                                className="w-24 h-24 object-cover rounded-lg mr-2"
                                            />
                                            <button
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
                                                {i18n("removeImage")}
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            {...getRootProps({
                                                className:
                                                    "border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer h-full flex flex-col justify-center overflow-hidden"
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <p className="overflow-hidden text-sm">{i18n("dropzoneMessage")}</p>
                                            <p className="overflow-hidden text-sm">{i18n("dropzoneFileTypes")}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Private Playlist Toggle */}
                                <div className="flex flex-col items-center justify-center">
                                    <label className="block text-sm font-bold mb-2 text-center">
                                        {i18n("privatePlaylist")}
                                    </label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={state.isPrivate}
                                            onChange={() => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    isPrivate: !state.isPrivate
                                                }));
                                            }}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 pt-2 flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => {
                                        onClose();
                                        resetState();
                                    }}
                                >
                                    {i18nCommon("cancel")}
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={handleExport}
                                >
                                    {i18n("export")}
                                </button>
                            </div>
                        </div>

                        {/* Setlist Songs Component */}
                        <SetlistSongsExport
                            setlist={setlist}
                            artistData={artistData}
                            onSongsFetched={(songs) =>
                                setState((prev) => ({
                                    ...prev,
                                    spotifySongs: songs
                                }))
                            }
                        />
                    </div>
                </div>
            </>
        )
    );
};

export default ExportDialog;
