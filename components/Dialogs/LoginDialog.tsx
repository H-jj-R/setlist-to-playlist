/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import LoginForm from "@components/Account/LoginForm";
import MessageDialog from "@components/Dialogs/MessageDialog";
import MessageDialogState from "@constants/messageDialogState";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useLoginDialogHook from "@hooks/useLoginDialogHook";
import { useTranslation } from "react-i18next";

/**
 * Props for the `LoginDialog` component.
 *
 * @property {Function} onClose - Function to handle closing the dialog.
 * @property {Function} onLoginSuccess - Function to handle actions after successful login.
 */
interface LoginDialogProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

/**
 * **LoginDialog Component**
 *
 * Dialog which holds the LoginForm component.
 *
 * @param LoginDialogProps - Component props.
 *
 * @returns {JSX.Element} The rendered `LoginDialog` component.
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ onClose, onLoginSuccess }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage login dialog state and interactions
    const { handleClose, handleSubmit, recaptchaRef, setState, state } = useLoginDialogHook(onClose, onLoginSuccess);

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
                        >
                            <FontAwesomeIcon id="fa-times-icon" className="h-6 w-6" icon={faTimes} />
                        </button>
                        <div id="login-form-container">
                            <LoginForm
                                handleSubmit={handleSubmit}
                                recaptchaRef={recaptchaRef}
                                setState={setState}
                                state={state}
                            />
                        </div>
                    </div>
                </div>
                {state.messageDialog.isOpen && (
                    <MessageDialog
                        message={state.messageDialog.message}
                        onClose={(): void => {
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

export default LoginDialog;
