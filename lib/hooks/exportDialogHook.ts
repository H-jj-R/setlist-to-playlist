/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { MessageDialogState } from "@constants/messageDialogState";
import { useAuth } from "@context/AuthContext";

interface ExportDialogHookProps {
    setlist: Record<string, any>;
    artistData: Record<string, any>;
    isOpen: boolean;
    predictedSetlist?: boolean;
    onClose: () => void;
}

/**
 * Hook for data handling on the ExportDialog component.
 */
export default function exportDialogHook({
    setlist,
    artistData,
    isOpen,
    predictedSetlist,
    onClose
}: ExportDialogHookProps) {
    const { t: i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState({
        playlistName: "" as string,
        playlistDescription: "" as string,
        image: null as File | null,
        imagePreview: null as string | ArrayBuffer | null,
        spotifySongs: null as Record<string, any> | null,
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
    });

    const MAX_IMAGE_FILE_SIZE = 256 * 1024; // 256 KB

    useEffect(() => {
        if (isOpen) {
            setState((prev) => ({
                ...prev,
                playlistName: predictedSetlist
                    ? `${artistData.spotifyArtist.name} ${i18n("exportSetlist:predictedSetlist")}`
                    : `${artistData.spotifyArtist.name} ${i18n("common:setlist")} - ${format(
                          ((dateString: string) => {
                              const [day, month, year] = dateString.split("-");
                              return new Date(`${year}-${month}-${day}`);
                          })(setlist.eventDate),
                          "MMMM dd, yyyy"
                      )}`
            }));
        }
    }, [isOpen, artistData, setlist]);

    const processImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
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

    const handleImageChange = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.onload = () => {
                    setState((prev) => ({
                        ...prev,
                        image: file,
                        imagePreview: reader.result
                    }));
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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageChange,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxFiles: 1
    });

    const handleExport = async () => {
        try {
            // Reset errors
            setState((prev) => ({ ...prev, error: null }));

            // Show the loading dialog
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: "",
                    type: MessageDialogState.Loading
                }
            }));

            if (!state.playlistName.trim()) {
                throw {
                    status: 400,
                    error: i18n("exportSetlist:noNameProvided")
                };
            }

            if (state.spotifySongs.length === 0) {
                throw {
                    status: 400,
                    error: i18n("exportSetlist:noSongsProvided")
                };
            }

            let base64Image = null;
            if (state.image) {
                base64Image = await processImage(state.image);
                if (!base64Image || base64Image.length > MAX_IMAGE_FILE_SIZE) {
                    throw {
                        status: 400,
                        error: i18n("exportSetlist:errorProcessingImage")
                    };
                }
            }

            const response = await fetch(`/api/controllers/create-spotify-playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage?.getItem("authToken")}`
                },
                body: JSON.stringify({
                    name: state.playlistName,
                    description: state.playlistDescription,
                    image: base64Image,
                    tracks: JSON.stringify(state.spotifySongs),
                    isLoggedIn: isAuthenticated
                })
            });
            const responseJson = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(responseJson.error) || i18n("common:unexpectedError")
                };
            }

            // Success
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
                    message: i18n(error.error),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    const resetState = () => {
        setState((prev) => ({
            ...prev,
            playlistName: "",
            playlistDescription: "",
            image: null,
            imagePreview: null,
            spotifySongs: null,
            messageDialog: {
                isOpen: false,
                message: "",
                type: MessageDialogState.Success
            }
        }));
    };

    return {
        state,
        setState,
        getRootProps,
        getInputProps,
        handleExport,
        resetState,
        onClose
    };
}
