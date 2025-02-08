/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MessageDialog from "@components/Dialogs/MessageDialog";
import LoginForm from "@components/Account/LoginForm";
import { MessageDialogState } from "@constants/messageDialogState";
import loginDialogHook from "@hooks/loginDialogHook";

interface LoginDialogProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

/**
 *
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ onClose, onLoginSuccess }) => {
    const { t: i18n } = useTranslation();
    const { state, setState, handleClose, handleSubmit } = loginDialogHook(onClose, onLoginSuccess);

    return (
        state.isDialogVisible && (
            <>
                {/* Background Overlay */}
                <div
                    id="background-overlay"
                    className={`z-20 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 ${
                        state.isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={handleClose}
                />

                {/* Dialog Box */}
                <div
                    id="dialog-box"
                    className={`z-30 fixed inset-0 flex justify-center items-center transition-all duration-300 ease-in-out ${
                        state.isVisible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        id="login-dialog"
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full flex flex-col gap-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 left-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            aria-label={i18n("common:close")}
                        >
                            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                        </button>

                        {/* Login Form */}
                        <div id="login-form-container">
                            <LoginForm handleSubmit={handleSubmit} state={state} setState={setState} />
                        </div>
                    </div>
                </div>

                {/* Message Dialog */}
                {state.messageDialog.isOpen && (
                    <MessageDialog
                        message={state.messageDialog.message}
                        type={state.messageDialog.type}
                        onClose={() => {
                            setState((prev) => ({
                                ...prev,
                                messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
                            }));
                        }}
                    />
                )}
            </>
        )
    );
};

export default LoginDialog;
