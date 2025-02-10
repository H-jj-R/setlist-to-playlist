/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import OTPInput from "@components/Account/OTPInput";
import LoginDialogState from "@constants/loginDialogState";
import { faEnvelope, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

interface LoginFormProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setState: any;
    state: any;
}

/**
 *
 */
const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, setState, state }): JSX.Element => {
    const { t: i18n } = useTranslation();

    const RECAPTCHA_SITE_KEY: string = "6LeSO8MqAAAAAPZJW7-h7yrBqb_6er-gLbOEcsc-";

    return (
        <>
            <h2 id="login-form-title" className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                {((): string => {
                    switch (state.dialogState) {
                        case LoginDialogState.ForgotPassword:
                            return i18n("account:forgotPasswordTitle");
                        case LoginDialogState.Login:
                            return i18n("account:login");
                        case LoginDialogState.ResetPassword:
                            return i18n("account:resetPassword");
                        case LoginDialogState.SignUp:
                            return i18n("account:signUp");
                    }
                })()}
            </h2>
            <form id="login-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {state.dialogState === LoginDialogState.SignUp && (
                    <div id="username-input-container" className="relative">
                        <input
                            id="username-input"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-lg transition duration-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            autoComplete="username"
                            maxLength={24}
                            name="username"
                            placeholder={i18n("account:username")}
                            required
                            type="text"
                        />
                        <FontAwesomeIcon
                            id="fa-user-circle-icon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 transform pl-1 text-gray-200"
                            icon={faUserCircle}
                        />
                    </div>
                )}
                {(state.dialogState === LoginDialogState.Login ||
                    state.dialogState === LoginDialogState.SignUp ||
                    state.dialogState === LoginDialogState.ForgotPassword) && (
                    <div id="email-input-container" className="relative">
                        <input
                            id="email-input"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-lg transition duration-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            autoComplete="email"
                            maxLength={320}
                            name="email"
                            placeholder={i18n("common:email")}
                            required
                            type="email"
                        />
                        <FontAwesomeIcon
                            id="fa-envelope-icon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 transform pl-1 text-gray-200"
                            icon={faEnvelope}
                        />
                    </div>
                )}
                {(state.dialogState === LoginDialogState.Login || state.dialogState === LoginDialogState.SignUp) && (
                    <div id="password-input-container" className="relative">
                        <input
                            id="password-input"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-lg transition duration-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                            maxLength={32}
                            name="password"
                            placeholder={i18n("account:password")}
                            required
                            type={state.passwordVisible ? "text" : "password"}
                        />
                        <FontAwesomeIcon
                            id="fa-lock-icon"
                            className="absolute left-3 top-1/2 -translate-y-1/2 transform pl-1 text-gray-200"
                            icon={faLock}
                        />
                        <button
                            id="toggle-password-visibility-btn"
                            className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-400 hover:text-gray-500"
                            onClick={(): void => {
                                setState((prev) => ({ ...prev, passwordVisible: !state.passwordVisible }));
                            }}
                            type="button"
                        >
                            {state.passwordVisible ? i18n("common:hide") : i18n("common:show")}
                        </button>
                    </div>
                )}
                {state.dialogState === LoginDialogState.ResetPassword && (
                    <>
                        <p id="reset-password-message" className="flex justify-center text-center">
                            {i18n("account:resetPasswordMessage")}
                        </p>
                        <OTPInput
                            setOtpInput={(otp: string): void => {
                                setState((prev) => ({ ...prev, otpInput: otp }));
                            }}
                        />
                        <div id="new-password-input-container" className="relative">
                            <input
                                id="new-password-input"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-lg transition duration-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                                maxLength={32}
                                name="password"
                                placeholder={i18n("account:newPassword")}
                                required
                                type={state.passwordVisible ? "text" : "password"}
                            />
                            <FontAwesomeIcon
                                id="fa-lock-icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 transform pl-1 text-gray-200"
                                icon={faLock}
                            />
                            <button
                                id="toggle-new-password-visibility"
                                className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-400 hover:text-gray-500"
                                onClick={(): void => {
                                    setState((prev) => ({ ...prev, passwordVisible: !state.passwordVisible }));
                                }}
                                type="button"
                            >
                                {state.passwordVisible ? i18n("common:hide") : i18n("common:show")}
                            </button>
                        </div>
                    </>
                )}
                {state.passwordError && (
                    <div id="password-error" className="text-sm text-red-500">
                        {state.passwordError}
                    </div>
                )}
                {state.dialogState === LoginDialogState.SignUp && (
                    <div id="recaptcha-container" className="flex justify-center">
                        <ReCAPTCHA
                            id="recaptcha"
                            onChange={(token: string): void => {
                                setState((prev) => ({ ...prev, recaptchaToken: token }));
                            }}
                            onExpired={(): void => {
                                setState((prev) => ({ ...prev, recaptchaToken: null }));
                            }}
                            sitekey={RECAPTCHA_SITE_KEY}
                        />
                    </div>
                )}
                {state.dialogState === LoginDialogState.Login && (
                    <div id="forgot-password-link-container" className="flex justify-center">
                        <p
                            id="forgot-password-link"
                            className="text-md inline-block cursor-pointer text-center text-blue-500 hover:underline"
                            onClick={(): void => {
                                setState((prev) => ({ ...prev, dialogState: LoginDialogState.ForgotPassword }));
                            }}
                        >
                            {i18n("account:forgotPassword")}
                        </p>
                    </div>
                )}
                <button
                    id="submit-btn"
                    className="rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 px-4 py-3 text-lg text-white transition duration-300 hover:from-purple-600 hover:to-blue-700 focus:outline-none"
                    type="submit"
                >
                    {state.dialogState === LoginDialogState.Login
                        ? i18n("account:login")
                        : state.dialogState === LoginDialogState.SignUp
                          ? i18n("account:signUp")
                          : i18n("account:resetPassword")}
                </button>
            </form>
            <div id="back-to-login-container" className="flex justify-center">
                {(state.dialogState === LoginDialogState.ForgotPassword ||
                    state.dialogState === LoginDialogState.ResetPassword) && (
                    <p
                        id="back-to-login-link"
                        className="text-md mt-2 inline-block cursor-pointer pt-2 text-center text-blue-500 hover:underline"
                        onClick={(): void => {
                            setState((prev) => ({ ...prev, dialogState: LoginDialogState.Login }));
                        }}
                    >
                        {i18n("account:backToLogin")}
                    </p>
                )}
                {(state.dialogState === LoginDialogState.Login || state.dialogState === LoginDialogState.SignUp) && (
                    <p
                        id="switch-login-signup-link"
                        className="text-md mt-2 inline-block cursor-pointer pt-2 text-center text-blue-500 hover:underline"
                        onClick={(): void => {
                            setState((prev) => ({
                                ...prev,
                                dialogState:
                                    state.dialogState === LoginDialogState.Login
                                        ? LoginDialogState.SignUp
                                        : LoginDialogState.Login
                            }));
                        }}
                    >
                        {state.dialogState === LoginDialogState.SignUp
                            ? i18n("account:alreadyHaveAccount")
                            : i18n("account:noAccount")}
                    </p>
                )}
            </div>
        </>
    );
};

export default LoginForm;
