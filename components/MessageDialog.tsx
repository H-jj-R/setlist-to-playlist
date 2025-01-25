import React from "react";
import CustomHashLoader from "./CustomHashLoader";
import ErrorMessage from "./ErrorMessage";

interface MessageDialogProps {
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "loading";
    onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ isOpen, message, type, onClose }) => {
    if (!isOpen) return null;

    return (
        <div id="dialog-container" className="fixed inset-0 flex items-center justify-center z-50">
            <div
                id="overlay"
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={type === "loading" ? undefined : onClose}
            ></div>
            <div
                id="dialog-box"
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-1/3 max-w-md text-center ${
                    type === "success" ? "border-green-500" : type === "error" ? "border-red-500" : "border-blue-500"
                } border`}
            >
                <h2
                    id="dialog-title"
                    className={`text-xl font-semibold mb-4 ${
                        type === "success" ? "text-green-500" : type === "error" ? "text-red-500" : "text-blue-500"
                    }`}
                >
                    {type === "success" ? "Success!" : type === "error" ? "Error!" : "Loading..."}
                </h2>
                <span id="dialog-message" className="text-gray-700 dark:text-gray-300">
                    {type === "loading" ? (
                        <div className="flex items-center justify-center h-full">
                            <CustomHashLoader showLoading={true} size={100} />
                        </div>
                    ) : type === "success" ? (
                        <p id="dialog-message" className="text-gray-700 dark:text-gray-300">
                            {message}
                        </p>
                    ) : (
                        <ErrorMessage message={message} />
                    )}
                </span>
                {type !== "loading" && (
                    <button
                        id="close-button"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageDialog;
