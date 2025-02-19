/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialogState from "@constants/messageDialogState";
import { useAuth } from "@context/AuthContext";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

/**
 * **useExportDialogHook**
 *
 * Custom hook for handling data and state management in the `ExportDialog` component.
 *
 * @param {Record<string, any>} artistData - The data for the selected artist.
 * @param {boolean} isOpen - Indicates if the export dialog is open.
 * @param {Function} onClose - Function to close the dialog.
 * @param {boolean} predictedSetlist - Determines if the setlist is predicted or an actual event setlist.
 * @param {Record<string, any>} setlist - The setlist data including event details.
 *
 * @returns Hook state and handlers.
 */
export default function useExportDialogHook(
    artistData: Record<string, any>,
    isOpen: boolean,
    onClose: () => void,
    predictedSetlist: boolean,
    setlist: Record<string, any>
) {
    const { isAuthenticated } = useAuth(); // Authentication context
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        image: null as File | null, // Uploaded image file for playlist
        imagePreview: null as ArrayBuffer | null | string, // Preview of the uploaded image
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }, // Controls status messages
        playlistDescription: "" as string, // User input playlist description
        playlistName: "" as string, // User input playlist name
        spotifySongs: null as null | Record<string, any> // Processed Spotify songs data for playlist
    });

    /**
     * Maximum image size (256 * 1024 = 262144 = 256 KB).
     */
    const MAX_IMAGE_FILE_SIZE: number = 262144;

    /**
     * Effect that instantly updates the playlist name when the dialog is opened.
     */
    useEffect((): void => {
        if (isOpen) {
            setState((prev) => ({
                ...prev,
                playlistName: predictedSetlist
                    ? `${artistData.spotifyArtist.name} ${i18n("exportSetlist:predictedSetlist")}`
                    : `${artistData.spotifyArtist.name} ${i18n("common:setlist")} - ${format(
                          ((dateString: string): Date => {
                              const [day, month, year] = dateString.split("-");
                              return new Date(`${year}-${month}-${day}`);
                          })(setlist.eventDate),
                          "MMMM dd, yyyy"
                      )}`
            }));
        }
    }, [isOpen, artistData, setlist]);

    /**
     * Processes and resizes an image file to fit within the maximum file size limit for Spotify.
     *
     * @param {File} file - The image file to process.
     * @returns {Promise<string>} A promise that resolves to the base64 representation of the resized image.
     */
    const processImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject): void => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: ProgressEvent<FileReader>): void => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = (): void => {
                    // Crop and draw the image centered on a square canvas
                    const minSize = Math.min(img.width, img.height);
                    const canvas = document.createElement("canvas");
                    canvas.width = minSize;
                    canvas.height = minSize;
                    canvas
                        .getContext("2d")!
                        .drawImage(
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

                    // Reduce image quality until it meets the file size constraint
                    while (fileSize > MAX_IMAGE_FILE_SIZE) {
                        const scaleFactor = Math.sqrt(MAX_IMAGE_FILE_SIZE / fileSize);
                        const newWidth = Math.floor(canvas.width * scaleFactor);
                        const newHeight = Math.floor(canvas.height * scaleFactor);

                        const tempCanvas = document.createElement("canvas");
                        tempCanvas.width = newWidth;
                        tempCanvas.height = newHeight;
                        tempCanvas.getContext("2d")!.drawImage(canvas, 0, 0, newWidth, newHeight);

                        canvas.width = newWidth;
                        canvas.height = newHeight;
                        canvas.getContext("2d")!.drawImage(tempCanvas, 0, 0);

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

    /**
     * Handles image selection and validation.
     *
     * @param {File[]} acceptedFiles - Array of accepted image files.
     */
    const handleImageChange = useCallback((acceptedFiles: File[]): void => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = (): void => {
                    setState((prev) => ({ ...prev, image: file, imagePreview: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("exportSetlist:invalidFileType"),
                        type: MessageDialogState.Error
                    }
                }));
            }
        }
    }, []);

    /**
     * Dropzone configuration for image file uploads
     */
    const { getInputProps, getRootProps } = useDropzone({
        accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
        maxFiles: 1,
        onDrop: handleImageChange
    });

    /**
     * Handles the export process by creating a Spotify playlist.
     */
    const handleExport = useCallback(async (): Promise<void> => {
        try {
            // Reset any previous errors
            setState((prev) => ({ ...prev, error: null }));

            // Show loading dialog while processing
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: "",
                    type: MessageDialogState.Loading
                }
            }));

            // Validate that a playlist name is provided
            if (!state.playlistName.trim()) {
                throw {
                    error: i18n("exportSetlist:noNameProvided"),
                    status: 400
                };
            }

            // Validate that there are songs in the playlist
            if (state.spotifySongs.length === 0) {
                throw {
                    error: i18n("exportSetlist:noSongsProvided"),
                    status: 400
                };
            }

            // If an image is provided, process it for upload
            let base64Image = null;
            if (state.image) {
                base64Image = await processImage(state.image);
                if (!base64Image || base64Image.length > MAX_IMAGE_FILE_SIZE) {
                    throw {
                        error: i18n("exportSetlist:errorProcessingImage"),
                        status: 400
                    };
                }
            }

            // Send request to backend to create the playlist
            const response = await fetch(`/api/controllers/create-spotify-playlist`, {
                body: JSON.stringify({
                    description: state.playlistDescription,
                    image: base64Image,
                    isLoggedIn: isAuthenticated,
                    name: state.playlistName,
                    tracks: JSON.stringify(state.spotifySongs)
                }),
                headers: {
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`,
                    "Content-Type": "application/json"
                },
                method: "POST"
            });
            const responseJson = await response.json();
            if (!response.ok) {
                throw {
                    error: i18n(responseJson.error),
                    status: response.status
                };
            }

            // Display success message if the playlist was created successfully
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: `${i18n("exportSetlist:exportSuccess")}\n${
                        responseJson.issue ? `${i18n("common:issue")}: ${i18n(responseJson.issue)}` : ""
                    }`,
                    type: MessageDialogState.Success
                }
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n(error.error) || i18n("common:unexpectedError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    }, [state, isAuthenticated]);

    /**
     * Resets the export dialog state, clearing all inputs and messages.
     */
    const resetState = useCallback((): void => {
        setState((prev) => ({
            ...prev,
            image: null,
            imagePreview: null,
            messageDialog: {
                isOpen: false,
                message: "",
                type: MessageDialogState.Success
            },
            playlistDescription: "",
            playlistName: "",
            spotifySongs: null
        }));
    }, []);

    return {
        getInputProps,
        getRootProps,
        handleExport,
        onClose,
        resetState,
        setState,
        state
    };
}
