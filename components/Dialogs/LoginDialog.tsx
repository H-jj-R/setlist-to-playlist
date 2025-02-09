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
import loginDialogHook from "@hooks/loginDialogHook";
import { useTranslation } from "react-i18next";

interface LoginDialogProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

/**
 *
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ onClose, onLoginSuccess }): JSX.Element => {
    const { t: i18n } = useTranslation();
    const { handleClose, handleSubmit, recaptchaRef, setState, state } = loginDialogHook(onClose, onLoginSuccess);

    return (
        state.isDialogVisible && (
            <>
                {/* Background Overlay */}
                <div
                    id="background-overlay"
                    className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-200 ${
                        state.isVisible ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    onClick={handleClose}
                />

                {/* Dialog Box */}
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
                        {/* Close Button */}
                        <button
                            id=""
                            className="absolute left-4 top-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label={i18n("common:close")}
                            onClick={handleClose}
                        >
                            <FontAwesomeIcon id="fa-times-icon" className="h-6 w-6" icon={faTimes} />
                        </button>

                        {/* Login Form */}
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

                {/* Message Dialog */}
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
