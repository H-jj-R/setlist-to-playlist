/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { LoginDialogState } from "@constants/loginDialogState";
import OTPInput from "../Account/OTPInput";

interface LoginFormProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    state: any;
    setState: any;
}

/**
 *
 */
const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, state, setState }) => {
    const { t: i18n } = useTranslation();

    const RECAPTCHA_SITE_KEY = "6LeSO8MqAAAAAPZJW7-h7yrBqb_6er-gLbOEcsc-";

    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
                {state.dialogState === LoginDialogState.Login
                    ? i18n("account:login")
                    : state.dialogState === LoginDialogState.SignUp
                    ? i18n("account:signUp")
                    : state.dialogState === LoginDialogState.ForgotPassword
                    ? i18n("account:forgotPasswordTitle")
                    : state.dialogState === LoginDialogState.ResetPassword
                    ? i18n("account:resetPassword")
                    : ""}
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
                {(state.dialogState === LoginDialogState.Login ||
                    state.dialogState === LoginDialogState.SignUp ||
                    state.dialogState === LoginDialogState.ForgotPassword) && (
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
                )}
                {(state.dialogState === LoginDialogState.Login || state.dialogState === LoginDialogState.SignUp) && (
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
                {state.dialogState === LoginDialogState.ResetPassword && (
                    <>
                        <p className="flex justify-center text-center">{i18n("account:resetPasswordMessage")}</p>
                        <OTPInput
                            setOtpInput={(otp) => {
                                setState((prev) => ({
                                    ...prev,
                                    otpInput: otp
                                }));
                            }}
                        ></OTPInput>
                        <div className="relative">
                            <input
                                name="password"
                                type={state.passwordVisible ? "text" : "password"}
                                placeholder={i18n("account:newPassword")}
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
                    </>
                )}
                {state.passwordError && <div className="text-red-500 text-sm">{state.passwordError}</div>}
                {state.dialogState === LoginDialogState.Login && (
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
                    className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-lg transition duration-300 focus:outline-none"
                >
                    {state.dialogState === LoginDialogState.Login
                        ? i18n("account:login")
                        : state.dialogState === LoginDialogState.SignUp
                        ? i18n("account:signUp")
                        : i18n("account:resetPassword")}
                </button>
            </form>
            <div className="flex justify-center">
                {(state.dialogState === LoginDialogState.ForgotPassword ||
                    state.dialogState === LoginDialogState.ResetPassword) && (
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
                )}
                {(state.dialogState === LoginDialogState.Login || state.dialogState === LoginDialogState.SignUp) && (
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
        </>
    );
};

export default LoginForm;
