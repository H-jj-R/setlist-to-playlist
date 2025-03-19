/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import MessageDialogState from "@constants/messageDialogState";
import { useTranslation } from "react-i18next";

/**
 * Props for the `MessageDialog` component.
 *
 * @property {string} message - The message to be displayed in the dialog.
 * @property {Function} onClose - Function to handle closing the dialog.
 * @property {MessageDialogState} type - The type of message (e.g. success, error, loading).
 */
interface MessageDialogProps {
    message: string;
    onClose: () => void;
    type: MessageDialogState;
}

/**
 * **MessageDialog Component**
 *
 * Displays a message dialog based on the provided type.
 *
 * @param MessageDialogProps - Component props.
 *
 * @returns The rendered `MessageDialog` component.
 */
const MessageDialog: React.FC<MessageDialogProps> = ({ message, onClose, type }) => {
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div id="message-dialog-container" className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                id="background-overlay"
                className="absolute inset-0 bg-black/50"
                onClick={type === MessageDialogState.Loading ? onClose : undefined}
            />
            <div
                id="message-dialog-box"
                className={`relative w-3/4 max-w-md rounded-lg bg-white p-6 text-center shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 dark:bg-gray-800 ${
                    type === MessageDialogState.Success
                        ? "border-green-500"
                        : type === MessageDialogState.Error
                          ? "border-red-500"
                          : "border-blue-500"
                } border`}
            >
                <h2
                    id="message-dialog-title"
                    className={`mb-4 text-xl font-semibold ${
                        type === MessageDialogState.Success
                            ? "text-green-500"
                            : type === MessageDialogState.Error
                              ? "text-red-500"
                              : "text-blue-500"
                    }`}
                >
                    {type === MessageDialogState.Success
                        ? i18n("common:success")
                        : type === MessageDialogState.Error
                          ? i18n("common:error")
                          : `${i18n("common:loading")}...`}
                </h2>
                <span id="message-dialog-message" className="text-gray-700 dark:text-gray-300">
                    {type === MessageDialogState.Loading ? (
                        <div id="loader" className="flex h-full items-center justify-center">
                            <CustomHashLoader showLoading={true} size={100} />
                        </div>
                    ) : type === MessageDialogState.Success ? (
                        <p id="dialog-message" className="text-gray-700 dark:text-gray-300">
                            {message}
                        </p>
                    ) : (
                        <ErrorMessage message={message} />
                    )}
                </span>
                {type !== MessageDialogState.Loading && (
                    <button
                        id="close-btn"
                        className="mt-4 rounded-sm bg-blue-500 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-blue-600"
                        onClick={onClose}
                    >
                        {i18n("common:close")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MessageDialog;
