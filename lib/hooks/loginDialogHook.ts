/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import LoginDialogState from "@constants/loginDialogState";
import MessageDialogState from "@constants/messageDialogState";
import { useCallback, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

/**
 * Hook for data handling on the login dialog.
 */
export default function loginDialogHook(onClose: () => void, onLoginSuccess: () => void) {
    const { t: i18n } = useTranslation();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [state, setState] = useState({
        dialogState: LoginDialogState.Login,
        isDialogVisible: true,
        isVisible: false,
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success },
        otpInput: null as null | string,
        passwordError: null as null | string,
        passwordVisible: false,
        recaptchaToken: null as null | string,
        storedEmail: null as null | string
    });

    const PASSWORD_REGEX: RegExp =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;

    useEffect((): void => {
        // Trigger the dimming animation after mounting
        setState((prev) => ({ ...prev, isVisible: true }));
    }, []);

    useEffect((): (() => void) => {
        if (!state.isVisible) {
            const timer = setTimeout(onClose, 200);
            return (): void => clearTimeout(timer);
        }
    }, [state.isVisible, onClose]);

    const handleClose = useCallback((): void => {
        setTimeout((): void => setState((prev) => ({ ...prev, isDialogVisible: false })), 300);
        setState((prev) => ({ ...prev, isVisible: false }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent): Promise<void> => {
            e.preventDefault();
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: "",
                    type: MessageDialogState.Loading
                }
            }));
            const formData = new FormData(e.target as HTMLFormElement);

            if (state.dialogState === LoginDialogState.ForgotPassword) {
                const email = formData.get("email") as string;
                handleForgotPassword(email);
            } else if (state.dialogState === LoginDialogState.ResetPassword) {
                handleResetPassword(formData.get("password") as string);
            } else {
                const password = formData.get("password") as string;
                if (state.dialogState === LoginDialogState.SignUp) {
                    if (!(await validatePassword(password))) {
                        return;
                    }
                }

                if (state.dialogState === LoginDialogState.SignUp) {
                    // Verify ReCAPTCHA
                    if (!(await verifyRecaptcha())) {
                        return;
                    }
                }

                const email = formData.get("email") as string;
                if (state.dialogState === LoginDialogState.SignUp) {
                    const username = formData.get("username") as string;
                    await handleSignUp(username, email, password);
                } else {
                    await handleLogin(email, password);
                }
            }
        },
        [state]
    );

    const handleLogin = async (email: string, password: string): Promise<void> => {
        try {
            const response = await fetch("/api/auth/login", {
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage?.setItem("authToken", token);
                onLoginSuccess();
                onClose();
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:loginFailed", { message: i18n(data.error) }),
                    status: data.status
                };
            }
        } catch (error) {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: error.error || i18n("common:unexpectedError"),
                    type: MessageDialogState.Error
                },
                recaptchaToken: null
            }));
        }
    };

    const handleSignUp = async (username: string, email: string, password: string): Promise<void> => {
        try {
            const response = await fetch("/api/auth/signup", {
                body: JSON.stringify({ email, password, username }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                setState((prev) => ({
                    ...prev,
                    dialogState: LoginDialogState.Login,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:signUpSuccess"),
                        type: MessageDialogState.Success
                    }
                }));
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:signUpFailed", { message: i18n(data.error) }),
                    status: data.status
                };
            }
        } catch (error) {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: error.error || i18n("common:unexpectedError"),
                    type: MessageDialogState.Error
                },
                recaptchaToken: null
            }));
        }
    };

    const validatePassword = async (password: string): Promise<boolean> => {
        if (!PASSWORD_REGEX.test(password)) {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: false,
                    message: "",
                    type: MessageDialogState.Success
                },
                passwordError: i18n("account:passwordError"),
                recaptchaToken: null
            }));
            return false;
        }
        setState((prev) => ({ ...prev, passwordError: null }));
        return true;
    };

    const verifyRecaptcha = async (): Promise<boolean> => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        // Ensure the reCAPTCHA token exists
        if (!state.recaptchaToken) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("account:recaptchaNotVerified"),
                    type: MessageDialogState.Error
                },
                recaptchaToken: null
            }));
            return false;
        }
        // Verify reCAPTCHA token
        const recaptchaResponse = await fetch("/api/auth/verify-recaptcha", {
            body: JSON.stringify({ token: state.recaptchaToken }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const { success } = await recaptchaResponse.json();
        if (!success) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("account:recaptchaNotVerified"),
                    type: MessageDialogState.Error
                }
            }));
            return false;
        }
        return true;
    };

    const handleForgotPassword = async (email: string): Promise<void> => {
        const response = await fetch("/api/auth/forgot-password", {
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
            method: "POST"
        });
        if (!response.ok) {
            const data = await response.json();
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n(data.error),
                    type: MessageDialogState.Error
                }
            }));
        } else {
            setState((prev) => ({
                ...prev,
                dialogState: LoginDialogState.ResetPassword,
                messageDialog: {
                    isOpen: false,
                    message: "",
                    type: MessageDialogState.Success
                },
                storedEmail: email
            }));
        }
    };

    const handleResetPassword = async (newPassword: string): Promise<void> => {
        if (!(await validatePassword(newPassword))) {
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                body: JSON.stringify({ email: state.storedEmail, newPassword, otp: state.otpInput }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                setState((prev) => ({
                    ...prev,
                    dialogState: LoginDialogState.Login,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:resetPasswordSuccess"),
                        type: MessageDialogState.Success
                    },
                    storedEmail: null
                }));
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:resetPasswordFailed", { message: i18n(data.error) }),
                    status: data.status
                };
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: error.error || i18n("common:unexpectedError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    return {
        handleClose,
        handleSubmit,
        recaptchaRef,
        setState,
        state
    };
}
