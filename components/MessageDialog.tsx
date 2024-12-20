import React from "react";
import ErrorMessage from "./ErrorMessage";

interface MessageDialogProps {
    isOpen: boolean;
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ isOpen, message, type, onClose }) => {
    if (!isOpen) return null;

    return (
        <div id="dialog-container" className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background Overlay */}
            <div id="overlay" className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            {/* Dialog Box */}
            <div
                id="dialog-box"
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-1/3 max-w-md text-center ${
                    type === "success" ? "border-green-500" : "border-red-500"
                } border`}
            >
                <h2
                    id="dialog-title"
                    className={`text-xl font-semibold mb-4 ${type === "success" ? "text-green-500" : "text-red-500"}`}
                >
                    {type === "success" ? "Success!" : "Error!"}
                </h2>
                {type === "success" ? (
                    <p id="dialog-message" className="text-gray-700 dark:text-gray-300">
                        {message}
                    </p>
                ) : (
                    <ErrorMessage message={message} />
                )}
                <button
                    id="close-button"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default MessageDialog;
