import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
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

    const [state, setState] = useState({
        playlistName: "",
        playlistDescription: "",
        isPrivate: false,
        image: null as File | null,
        imagePreview: null as any,
        spotifySongs: null as any,
        error: null as string | null
    });

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageChange,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxFiles: 1
    });

    const handleExport = async () => {
        if (!state.playlistName.trim()) {
            setState((prev) => ({ ...prev, error: i18n("playlistNameRequired") }));
            return;
        }

        try {
            // Reset errors
            setState((prev) => ({ ...prev, error: null }));

            let base64Image = null;
            if (state.image) {
                base64Image = await processImage(state.image);
                if (!base64Image || base64Image.length > MAX_IMAGE_FILE_SIZE) {
                    throw new Error("Error processing image or file size too large.");
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
                    isprivate: state.isPrivate,
                    image: base64Image,
                    spotifySongs: JSON.stringify(state.spotifySongs)
                })
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(
                    `${response.status}: Failed to fetch data - Error: ${
                        errorResponse.error?.message || "Unknown error"
                    }`
                );
            }

            console.log(await response.json());
            // Success
            alert(i18n("exportSuccess"));
            onClose();
            resetState();
        } catch (error) {
            console.error(error);
            setState((prev) => ({ ...prev, error: i18n("exportFailed") }));
        }
    };

    const resetState = () => {
        setState({
            playlistName: "",
            playlistDescription: "",
            isPrivate: false,
            image: null,
            imagePreview: null,
            spotifySongs: null,
            error: null
        });
    };

    return {
        state,
        i18nCommon,
        i18n,
        setState,
        getRootProps,
        getInputProps,
        handleExport,
        resetState,
        onClose
    };
}
