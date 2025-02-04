import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelope, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import MessageDialog from "@components/Dialogs/MessageDialog";
import { LoginDialogState } from "@constants/loginDialogState";
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

    const RECAPTCHA_SITE_KEY = "6LeSO8MqAAAAAPZJW7-h7yrBqb_6er-gLbOEcsc-";

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
                ></div>

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
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
                                {state.dialogState === LoginDialogState.SignUp
                                    ? i18n("account:signUp")
                                    : state.dialogState === LoginDialogState.ForgotPassword
                                    ? i18n("account:forgotPasswordTitle")
                                    : i18n("account:login")}
                            </h2>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                {state.dialogState === LoginDialogState.SignUp && (
                                    <div className="relative">
                                        <input
                                            name="username"
                                            type="text"
                                            placeholder={i18n("account:username")}
                                            maxLength={24}
                                            required
                                            autoComplete="username"
                                            className="px-4 py-3 border border-gray-300 rounded-lg text-lg w-full transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none pl-10"
                                        />
                                        <FontAwesomeIcon
                                            icon={faUserCircle}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 pl-1"
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder={i18n("common:email")}
                                        maxLength={320}
                                        required
                                        autoComplete="email"
                                        className="px-4 py-3 border border-gray-300 rounded-lg text-lg w-full transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none pl-10"
                                    />
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 pl-1"
                                    />
                                </div>
                                {!(state.dialogState === LoginDialogState.ForgotPassword) && (
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={state.passwordVisible ? "text" : "password"}
                                            placeholder={i18n("account:password")}
                                            maxLength={32}
                                            required
                                            className="px-4 py-3 border border-gray-300 rounded-lg text-lg w-full transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none pl-10"
                                        />
                                        <FontAwesomeIcon
                                            icon={faLock}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 pl-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    passwordVisible: !state.passwordVisible
                                                }));
                                            }}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-500 pr-2"
                                        >
                                            {state.passwordVisible ? i18n("common:hide") : i18n("common:show")}
                                        </button>
                                    </div>
                                )}
                                {state.passwordError && (
                                    <div className="text-red-500 text-sm">{state.passwordError}</div>
                                )}
                                {!(state.dialogState === LoginDialogState.SignUp) &&
                                    !(state.dialogState === LoginDialogState.ForgotPassword) && (
                                        <div className="flex justify-center">
                                            <p
                                                className="inline-block text-md text-center cursor-pointer text-blue-500 hover:underline"
                                                onClick={() => {
                                                    setState((prev) => ({
                                                        ...prev,
                                                        dialogState: LoginDialogState.ForgotPassword
                                                    }));
                                                }}
                                            >
                                                {i18n("account:forgotPassword")}
                                            </p>
                                        </div>
                                    )}
                                {state.dialogState === LoginDialogState.SignUp && (
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            sitekey={RECAPTCHA_SITE_KEY}
                                            onChange={(token) => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    recaptchaToken: token
                                                }));
                                            }}
                                            onExpired={() => {
                                                setState((prev) => ({
                                                    ...prev,
                                                    recaptchaToken: null
                                                }));
                                            }}
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    {state.dialogState === LoginDialogState.SignUp
                                        ? i18n("account:signUp")
                                        : state.dialogState === LoginDialogState.ForgotPassword
                                        ? i18n("account:resetPassword")
                                        : i18n("account:login")}
                                </button>
                            </form>
                            <div className="flex justify-center">
                                {state.dialogState === LoginDialogState.ForgotPassword ? (
                                    <p
                                        className="inline-block text-md text-center mt-2 pt-2 cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev,
                                                dialogState: LoginDialogState.Login
                                            }));
                                        }}
                                    >
                                        {i18n("account:backToLogin")}
                                    </p>
                                ) : (
                                    <p
                                        className="inline-block text-md text-center mt-2 pt-2 cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => {
                                            state.dialogState === LoginDialogState.Login
                                                ? setState((prev) => ({
                                                      ...prev,
                                                      dialogState: LoginDialogState.SignUp
                                                  }))
                                                : setState((prev) => ({
                                                      ...prev,
                                                      dialogState: LoginDialogState.Login
                                                  }));
                                        }}
                                    >
                                        {state.dialogState === LoginDialogState.SignUp
                                            ? i18n("account:alreadyHaveAccount")
                                            : i18n("account:noAccount")}
                                    </p>
                                )}
                            </div>
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
