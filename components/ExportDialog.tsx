import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useDropzone } from "react-dropzone";
import SetlistSongsExport from "./SetlistSongsExport";

interface ExportDialogProps {
    setlist: Record<string, any>; // The setlist data to be exported
    artistData: Record<string, any>;
    isOpen: boolean; // Controls the visibility of the dialog
    onClose: () => void; // Close function
}

const ExportDialog: React.FC<ExportDialogProps> = ({ setlist, artistData, isOpen, onClose }) => {
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18n } = useTranslation("export-setlist");

    const [state, setState] = useState({
        playlistName: "" as string,
        playlistDescription: "" as string,
        isPrivate: false as boolean,
        image: null as File | null,
        imagePreview: null as any,
        error: null as string | null
    });

    useEffect(() => {
        if (isOpen) {
            setState((prev) => ({
                ...prev,
                playlistName: `${artistData.spotifyArtist.name} Setlist - ${format(
                    parseDate(setlist.eventDate),
                    "MMMM dd, yyyy"
                )}`
            }));
        }
    }, [isOpen]);

    const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    const MAX_IMAGE_FILE_SIZE = 256 * 1024; // 256 KB

    const processImage = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result as string;
                img.onload = () => {
                    // Crop to 1:1 aspect ratio
                    const minSize = Math.min(img.width, img.height);
                    const canvas = document.createElement("canvas");
                    canvas.width = minSize;
                    canvas.height = minSize;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(
                        img,
                        (img.width - minSize) / 2,
                        (img.height - minSize) / 2,
                        minSize,
                        minSize,
                        0,
                        0,
                        minSize,
                        minSize
                    );

                    let base64Image = canvas.toDataURL("image/jpeg");
                    let fileSize = base64Image.length;

                    // Downscale resolution until under 256KB
                    while (fileSize > MAX_IMAGE_FILE_SIZE) {
                        const scaleFactor = Math.sqrt(MAX_IMAGE_FILE_SIZE / fileSize);
                        const newWidth = Math.floor(canvas.width * scaleFactor);
                        const newHeight = Math.floor(canvas.height * scaleFactor);

                        const tempCanvas = document.createElement("canvas");
                        tempCanvas.width = newWidth;
                        tempCanvas.height = newHeight;
                        const tempCtx = tempCanvas.getContext("2d");
                        tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        ctx.drawImage(tempCanvas, 0, 0);

                        base64Image = canvas.toDataURL("image/jpeg");
                        fileSize = base64Image.length;
                    }

                    resolve(base64Image);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    // Handle file input change (cover image)
    const handleImageChange = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = () => {
                    setState((prev) => ({
                        ...prev,
                        image: file,
                        imagePreview: reader.result,
                        error: null
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                setState((prev) => ({
                    ...prev,
                    error: "Please upload a JPEG or PNG image."
                }));
            }
        }
    }, []);

    const removeImage = () => {
        setState((prev) => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageChange,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxFiles: 1
    });

    const handleExport = async () => {
        // TODO
    };

    return (
        isOpen && (
            <>
                {/* Background Overlay */}
                <div
                    className={`z-20 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ${
                        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={onClose}
                ></div>

                {/* Dialog Box */}
                <div
                    className={`z-30 fixed inset-0 flex justify-center items-center transition-all duration-500 ease-in-out ${
                        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                    }`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-4/5 max-w-5xl flex flex-col md:flex-row gap-6 max-h-[50vh] overflow-y-auto">
                        {/* Main Export Dialog */}
                        <div className="flex-1">
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
                                <div className="flex-1">
                                    {state.imagePreview ? (
                                        <div className="flex items-center">
                                            <img
                                                src={state.imagePreview}
                                                alt="Playlist Cover"
                                                className="w-24 h-24 object-cover rounded-lg mr-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                {i18n("removeImage")}
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            {...getRootProps({
                                                className:
                                                    "border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer"
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <p>{i18n("dropzoneMessage")}</p>
                                            <p>{i18n("dropzoneFileTypes")}</p>
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
                                            onChange={() =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    isPrivate: !state.isPrivate
                                                }))
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={() => {
                                        onClose();
                                        setState((prev) => ({
                                            ...prev,
                                            playlistName: "",
                                            playlistDescription: "",
                                            isPrivate: false,
                                            image: null,
                                            imagePreview: null,
                                            error: null
                                        }));
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
                        <SetlistSongsExport setlist={setlist} artistData={artistData} />
                    </div>
                </div>
            </>
        )
    );
};

export default ExportDialog;
