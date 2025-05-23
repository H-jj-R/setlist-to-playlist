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

/**
 * Props for the `LoginForm` component.
 *
 * @property {Function} handleSubmit - Function to handle form submission.
 * @property {React.RefObject<ReCAPTCHA>} recaptchaRef - Reference to the reCAPTCHA instance.
 * @property {Function} setState - Function to update component state.
 * @property {any} state - Current state of the login form.
 */
interface LoginFormProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    recaptchaRef: React.RefObject<ReCAPTCHA>;
    setState: Function;
    state: any;
}

/**
 * **LoginForm Component**
 *
 * Gives the user full login & signup options.
 *
 * @param LoginFormProps - Component props.
 *
 * @returns The rendered `LoginForm` component.
 */
const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, recaptchaRef, setState, state }) => {
    const { t: i18n } = useTranslation(); // Translation hook

    /**
     * Site key used to validate reCAPTCHA input.
     */
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
                            className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                            aria-describedby={state.usernameError ? "username-error" : undefined}
                            aria-label={i18n("account:username")}
                            autoComplete="username"
                            maxLength={20}
                            name="username"
                            placeholder={i18n("account:username")}
                            required
                            type="text"
                        />
                        <FontAwesomeIcon
                            id="fa-user-circle-icon"
                            className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                            icon={faUserCircle}
                        />
                    </div>
                )}
                {state.usernameError && (
                    <div id="username-error" className="text-sm text-red-500" aria-live="assertive">
                        {state.usernameError}
                    </div>
                )}
                {(state.dialogState === LoginDialogState.Login ||
                    state.dialogState === LoginDialogState.SignUp ||
                    state.dialogState === LoginDialogState.ForgotPassword) && (
                    <div id="email-input-container" className="relative">
                        <input
                            id="email-input"
                            className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                            aria-label={i18n("common:email")}
                            autoComplete="email"
                            maxLength={320}
                            name="email"
                            placeholder={i18n("common:email")}
                            required
                            type="email"
                        />
                        <FontAwesomeIcon
                            id="fa-envelope-icon"
                            className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                            icon={faEnvelope}
                        />
                    </div>
                )}
                {(state.dialogState === LoginDialogState.Login || state.dialogState === LoginDialogState.SignUp) && (
                    <div id="password-input-container" className="relative">
                        <input
                            id="password-input"
                            className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                            aria-describedby={state.passwordError ? "password-error" : undefined}
                            aria-label={i18n("account:password")}
                            maxLength={32}
                            name="password"
                            placeholder={i18n("account:password")}
                            required
                            type={state.passwordVisible ? "text" : "password"}
                        />
                        <FontAwesomeIcon
                            id="fa-lock-icon"
                            className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                            icon={faLock}
                        />
                        {!(window.navigator.userAgent.toLowerCase().indexOf("edg") > -1) && (
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
                        )}
                    </div>
                )}
                {state.dialogState === LoginDialogState.ResetPassword && (
                    <>
                        <p
                            id="reset-password-message"
                            className="flex justify-center text-center text-gray-900 dark:text-gray-100"
                        >
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
                                className="w-full rounded-lg border border-gray-900 bg-white px-4 py-3 pl-10 text-lg text-black transition duration-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-200 focus:outline-hidden dark:border-gray-300 dark:bg-black dark:text-white"
                                aria-label={i18n("account:newPassword")}
                                maxLength={32}
                                name="password"
                                placeholder={i18n("account:newPassword")}
                                required
                                type={state.passwordVisible ? "text" : "password"}
                            />
                            <FontAwesomeIcon
                                id="fa-lock-icon"
                                className="absolute top-1/2 left-3 -translate-y-1/2 transform pl-1 text-gray-800 dark:text-gray-200"
                                icon={faLock}
                            />
                            {!(window.navigator.userAgent.toLowerCase().indexOf("edg") > -1) && (
                                <button
                                    id="toggle-new-password-visibility-btn"
                                    className="absolute inset-y-0 right-3 flex items-center pr-2 text-gray-700 transition hover:cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-500"
                                    onClick={(): void => {
                                        setState((prev) => ({ ...prev, passwordVisible: !state.passwordVisible }));
                                    }}
                                    role="button"
                                    type="button"
                                >
                                    {state.passwordVisible ? i18n("common:hide") : i18n("common:show")}
                                </button>
                            )}
                        </div>
                    </>
                )}
                {state.passwordError && (
                    <div id="password-error" className="text-sm text-red-500" aria-live="assertive">
                        {state.passwordError}
                    </div>
                )}
                {state.dialogState === LoginDialogState.SignUp && (
                    <div id="recaptcha-container" className="flex justify-center">
                        <ReCAPTCHA
                            id="recaptcha"
                            aria-describedby="recaptcha-description"
                            onChange={(token: string): void => {
                                setState((prev) => ({ ...prev, recaptchaToken: token }));
                            }}
                            onExpired={(): void => {
                                setState((prev) => ({ ...prev, recaptchaToken: null }));
                            }}
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_SITE_KEY}
                        />
                        <p id="recaptcha-description" className="sr-only">
                            {i18n("account:recaptchaDescription")}
                        </p>
                    </div>
                )}
                {state.dialogState === LoginDialogState.Login && (
                    <div id="forgot-password-link-container" className="flex justify-center">
                        <p
                            id="forgot-password-link"
                            className="text-md inline-block cursor-pointer text-center text-blue-500 hover:underline"
                            onClick={(): void => {
                                setState((prev) => ({
                                    ...prev,
                                    dialogState: LoginDialogState.ForgotPassword,
                                    passwordError: null,
                                    usernameError: null
                                }));
                            }}
                            role="button"
                        >
                            {i18n("account:forgotPassword")}
                        </p>
                    </div>
                )}
                <button
                    id="submit-btn"
                    className="rounded-lg bg-linear-to-br from-purple-600 to-blue-600 px-4 py-3 text-lg text-white transition duration-300 hover:cursor-pointer hover:from-purple-600 hover:to-blue-700 focus:outline-hidden"
                    role="button"
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
                            setState((prev) => ({
                                ...prev,
                                dialogState: LoginDialogState.Login,
                                passwordError: null,
                                usernameError: null
                            }));
                        }}
                        role="button"
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
                                        : LoginDialogState.Login,
                                passwordError: null,
                                usernameError: null
                            }));
                        }}
                        role="button"
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
