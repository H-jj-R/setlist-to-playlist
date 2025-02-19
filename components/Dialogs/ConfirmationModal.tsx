/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

/**
 * Props for the `ConfirmationModal` component.
 *
 * @property {Function} onCancel - Function to handle cancellation.
 * @property {Function} onConfirm - Function to handle confirmation.
 */
interface ConfirmationModalProps {
    onCancel: () => void;
    onConfirm: () => void;
}

/**
 * **ConfirmationModal Component**
 *
 * Displays a modal to get confirmation from the user before proceeding with an action.
 *
 * @param ConfirmationModalProps - Component props.
 *
 * @returns {JSX.Element} The rendered `ConfirmationModal` component.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onCancel, onConfirm }): JSX.Element => {
    const { resolvedTheme } = useTheme(); // Theme setting hook
    const { t: i18n } = useTranslation(); // Translation hook

    return (
        <div
            id="confirmation-modal-background-container"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div
                id="confirmation-modal-container"
                className={`w-3/4 max-w-sm rounded-lg p-6 shadow-lg ${
                    resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                }`}
            >
                <h2 id="confirmation-modal-title" className="mb-4 text-xl font-bold">
                    {i18n("common:areYouSure")}
                </h2>
                <p id="confirmation-modal-message" className="mb-6">
                    {i18n("account:permanentAction")}
                </p>
                <div id="confirmation-modal-btns-container" className="flex justify-between">
                    <button
                        id="confirm-btn"
                        className="rounded bg-red-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        {i18n("account:yesDelete")}
                    </button>
                    <button
                        id="cancel-btn"
                        className="rounded bg-gray-300 px-4 py-2 text-gray-800 transition-colors duration-300 hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        {i18n("common:cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
