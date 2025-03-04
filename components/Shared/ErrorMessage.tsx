/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Props for the `ErrorMessage` component.
 *
 * @property {string} message - The error message to display.
 * @property {boolean} [small] - If true, displays a smaller version of the error message.
 */
interface ErrorMessageProps {
    message: string;
    small?: boolean;
}

/**
 * **ErrorMessage Component**
 *
 * Displays an error message with a warning icon.
 *
 * @param ErrorMessageProps - The component props.
 *
 * @returns The rendered `ErrorMessage` component.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, small }) => {
    return (
        <div
            id="error-container"
            className={`flex ${small ? "items-center gap-4" : "flex-col items-center gap-2"} ${
                small ? "p-4" : "p-6"
            } rounded-lg border border-red-300 bg-red-100 text-red-700 shadow-md`}
        >
            <FontAwesomeIcon
                id="fa-triangle-exclamation-icon"
                className={`text-red-500 ${small ? "h-6 w-6" : "h-10 w-10"}`}
                icon={faTriangleExclamation}
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
