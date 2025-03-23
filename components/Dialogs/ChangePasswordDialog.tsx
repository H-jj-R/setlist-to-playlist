/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import useChangePasswordHook from "@/lib/hooks/useChangePasswordHook";
import MessageDialog from "@components/Dialogs/MessageDialog";
import MessageDialogState from "@constants/messageDialogState";
import { faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

/**
 * Props for the `ChangePassword` component.
 *
 * @property {string} email - Email of currently logged in user.
 * @property {Function} onClose - Function to handle closing the dialog.
 */
interface ChangePasswordDialogProps {
    email: string;
    onClose: () => void;
}

/**
 * **ChangePasswordDialog Component**
 *
 * Dialog which holds the functionality to change a user's password.
 *
 * @param ChangePasswordDialogProps - Component props.
 *
 * @returns The rendered `ChangePasswordDialog` component.
 */
const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ email, onClose }) => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage dialog state and interactions
    const { handleClose, handleSubmit, setState, state } = useChangePasswordHook(email, onClose);

    return (
        state.isDialogVisible && (
            <>
                <div
                    id="background-overlay"
                    className={`fixed inset-0 z-20 bg-black transition-opacity duration-200 ${
                        state.isVisible ? "opacity-50" : "pointer-events-none opacity-0"
                    }`}
                    onClick={handleClose}
                />
                <div
                    id="dialog-box"
                    className={`fixed inset-0 z-30 flex items-center justify-center transition-all duration-300 ease-in-out ${
                        state.isVisible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        id="login-dialog"
                        className="relative flex w-full max-w-sm flex-col gap-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
                    >
                        <button
                            id="close-btn"
                            className="absolute top-6 left-4 text-gray-500 transition hover:cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label={i18n("common:close")}
                            onClick={handleClose}
                            role="button"
                        >
                            <FontAwesomeIcon id="fa-times-icon" className="text-2xl" icon={faTimes} />
                        </button>
                        <h2
                            id="login-form-title"
                            className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100"
                        >
                            {i18n("account:changePassword")}
                        </h2>
                        <form id="login-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div id="password-input-container" className="relative">
                                <input
                                    id="password-input"
                                    className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                                    aria-label={i18n("account:currentPassword")}
                                    maxLength={32}
                                    name="password"
                                    placeholder={i18n("account:currentPassword")}
                                    required
                                    type={state.passwordVisible ? "text" : "password"}
                                />
                                <FontAwesomeIcon
                                    id="fa-lock-icon"
                                    className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                                    icon={faLock}
                                />
                                <button
                                    id="toggle-password-visibility-btn"
                                    className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-700 transition hover:cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500"
                                    onClick={(): void => {
                                        setState((prev) => ({ ...prev, passwordVisible: !state.passwordVisible }));
                                    }}
                                    role="button"
                                    type="button"
                                >
                                    {state.passwordVisible ? i18n("common:hide") : i18n("common:show")}
                                </button>
                            </div>
                            <div id="new-password-input-container" className="relative">
                                <input
                                    id="new-password-input"
                                    className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                                    aria-label={i18n("account:newPassword")}
                                    maxLength={32}
                                    name="newPassword"
                                    placeholder={i18n("account:newPassword")}
                                    required
                                    type={state.newPasswordVisible ? "text" : "password"}
                                />
                                <FontAwesomeIcon
                                    id="fa-lock-icon"
                                    className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                                    icon={faLock}
                                />
                                <button
                                    id="toggle-new-password-visibility-btn"
                                    className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-700 transition hover:cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500"
                                    onClick={(): void => {
                                        setState((prev) => ({
                                            ...prev,
                                            newPasswordVisible: !state.newPasswordVisible
                                        }));
                                    }}
                                    role="button"
                                    type="button"
                                >
                                    {state.newPasswordVisible ? i18n("common:hide") : i18n("common:show")}
                                </button>
                            </div>
                            {state.passwordError && (
                                <div id="password-error" className="text-sm text-red-500">
                                    {state.passwordError}
                                </div>
                            )}
                            <button
                                id="submit-btn"
                                className="rounded-lg bg-linear-to-br from-purple-600 to-blue-600 px-4 py-3 text-lg text-white transition duration-300 hover:cursor-pointer hover:from-purple-600 hover:to-blue-700 focus:outline-hidden"
                                role="button"
                                type="submit"
                            >
                                {i18n("account:changePassword")}
                            </button>
                        </form>
                    </div>
                </div>
                {state.messageDialog.isOpen && (
                    <MessageDialog
                        message={state.messageDialog.message}
                        onClose={(): void => {
                            if (state.messageDialog.type === MessageDialogState.Success) handleClose();
                            setState((prev) => ({
                                ...prev,
                                messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
                            }));
                        }}
                        type={state.messageDialog.type}
                    />
                )}
            </>
        )
    );
};

export default ChangePasswordDialog;
