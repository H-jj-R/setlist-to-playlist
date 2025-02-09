/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ErrorMessageProps {
    message: string;
    small?: boolean;
}

/**
 *
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, small }) => {
    if (!message) return null;

    return (
        <div
            id="error-container"
            className={`flex ${small ? "items-center gap-4" : "flex-col items-center gap-2"} ${
                small ? "p-4" : "p-6"
            } rounded-lg border border-red-300 bg-red-100 text-red-700 shadow-md`}
        >
            <FontAwesomeIcon
                id="error-icon"
                icon={faTriangleExclamation}
                className={`text-red-500 ${small ? "h-6 w-6" : "h-10 w-10"}`}
            />
            <span
                id="error-message"
                className={`${small ? "text-sm font-medium" : "text-lg font-semibold"} text-center`}
            >
                {message}
            </span>
        </div>
    );
};

export default ErrorMessage;
