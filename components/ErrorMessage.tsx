import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

interface ErrorMessageProps {
    message: string; // Error message to display
}

/**
 * Error message box
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null; // Don't render if there's no error message

    return (
        <div
            className={"flex items-center gap-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-md"}
        >
            <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6 text-red-500" />
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};

export default ErrorMessage;
