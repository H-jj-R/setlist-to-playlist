/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import { MessageDialogState } from "@constants/messageDialogState";

interface MessageDialogProps {
    message: string;
    type: MessageDialogState;
    onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ message, type, onClose }) => {
    const { t: i18n } = useTranslation();

    return (
        <div id="dialog-container" className="fixed inset-0 flex items-center justify-center z-50">
            <div
                id="background-overlay"
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={type === MessageDialogState.Loading ? undefined : onClose}
            />
            <div
                id="dialog-box"
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-1/3 max-w-md text-center ${
                    type === MessageDialogState.Success
                        ? "border-green-500"
                        : type === MessageDialogState.Error
                          ? "border-red-500"
                          : "border-blue-500"
                } border`}
            >
                <h2
                    id="dialog-title"
                    className={`text-xl font-semibold mb-4 ${
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
                <span id="dialog-message" className="text-gray-700 dark:text-gray-300">
                    {type === MessageDialogState.Loading ? (
                        <div className="flex items-center justify-center h-full">
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
                        id="close-button"
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
