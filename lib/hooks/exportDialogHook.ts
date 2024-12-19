import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format, set } from "date-fns";
import { useDropzone } from "react-dropzone";

interface ExportDialogHookProps {
    setlist: Record<string, any>;
    artistData: Record<string, any>;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Hook for data handling on ExportDialog component.
 */
export default function exportDialogHook({ setlist, artistData, isOpen, onClose }: ExportDialogHookProps) {
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18n } = useTranslation("export-setlist");
    const { t: i18nErrors } = useTranslation("errors");
    const [state, setState] = useState({
        playlistName: "",
        playlistDescription: "",
        image: null as File | null,
        imagePreview: null as any,
        spotifySongs: null as any
    });
    const [messageDialog, setMessageDialog] = useState({ isOpen: false, message: "", type: "success" });

    const MAX_IMAGE_FILE_SIZE = 256 * 1024; // 256 KB

    useEffect(() => {
        if (isOpen) {
            setState((prev) => ({
                ...prev,
                playlistName: `${artistData.spotifyArtist.name} Setlist - ${format(
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
                // TODO: Should I show error message if not correct file type?
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
            if (!state.playlistName.trim()) {
                throw {
                    status: 400,
                    error: "No name provided."
                };
            }

            let base64Image = null;
            if (state.image) {
                base64Image = await processImage(state.image);
                if (!base64Image || base64Image.length > MAX_IMAGE_FILE_SIZE) {
                    throw {
                        status: 400,
                        error: "Error processing image or file size too large."
                    };
                }
            }

            const response = await fetch(`/api/controllers/create-spotify-playlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: state.playlistName,
                    description: state.playlistDescription,
                    image: base64Image,
                    tracks: JSON.stringify(state.spotifySongs)
                })
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw {
                    status: response.status,
                    error: errorResponse.error || "Unknown error"
                };
            }

            // Success
            setMessageDialog({
                isOpen: true,
                message: i18n("exportSuccess"),
                type: "success"
            });
        } catch (error) {
            console.error(error);
            setMessageDialog({
                isOpen: true,
                message: `${error.status}: ${i18nErrors(error.error)}`,
                type: "error"
            });
        }
    };

    const resetState = () => {
        setState({
            playlistName: "",
            playlistDescription: "",
            image: null,
            imagePreview: null,
            spotifySongs: null
        });
        setMessageDialog({ isOpen: false, message: "", type: "success" });
    };

    return {
        state,
        i18nCommon,
        i18n,
        messageDialog,
        setMessageDialog,
        setState,
        getRootProps,
        getInputProps,
        handleExport,
        resetState,
        onClose
    };
}
