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
 * **loginDialogHook**
 *
 * Custom hook for handling data and state management in the `LoginDialog` component.
 *
 * @param {Function} onClose - Function to execute when the dialog is closed.
 * @param {Function} onLoginSuccess - Function to execute on successful login.
 *
 * @returns Hook state and handlers.
 */
export default function loginDialogHook(onClose: () => void, onLoginSuccess: () => void) {
    const { t: i18n } = useTranslation(); // Translation hook
    const recaptchaRef = useRef<ReCAPTCHA>(null); // Reference for ReCAPTCHA component
    const [state, setState] = useState({
        dialogState: LoginDialogState.Login, // Tracks state of dialog to display
        isDialogVisible: true, // Controls the visibility of the dialog
        isVisible: false, // Controls the animation of the dialog
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }, // Controls status messages
        otpInput: null as null | string, // Stores one-time password input
        passwordError: null as null | string, // Stores password validation errors
        passwordVisible: false, // Tracks password visibility
        recaptchaToken: null as null | string, // Stores the ReCAPTCHA verification token
        storedEmail: null as null | string // Stores the user's email during password reset
    });

    /**
     * Regular expression for validating passwords.
     * Ensures at least one uppercase letter, one lowercase letter, one number,
     * and one special character, with a length between 8 and 32 characters.
     */
    const PASSWORD_REGEX: RegExp =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;

    /**
     * Runs when the component mounts.
     * Triggers the fade-in animation after mounting.
     */
    useEffect((): void => {
        setState((prev) => ({ ...prev, isVisible: true }));
    }, []);

    /**
     * Handles closing the dialog with a delay.
     * If `isVisible` is false, waits 200ms before calling `onClose`.
     */
    useEffect((): (() => void) => {
        if (!state.isVisible) {
            const timer = setTimeout(onClose, 200);
            return (): void => clearTimeout(timer);
        }
    }, [state.isVisible, onClose]);

    /**
     * Closes the login dialog with a fade-out animation.
     */
    const handleClose = useCallback((): void => {
        setTimeout((): void => setState((prev) => ({ ...prev, isDialogVisible: false })), 300);
        setState((prev) => ({ ...prev, isVisible: false }));
    }, []);

    /**
     * Handles form submission for login, signup, and password reset.
     * Determines the current authentication state and processes the request accordingly.
     *
     * @param {React.FormEvent} e - The form submit event.
     */
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

            // Handle accordingly depending on dialog state
            if (state.dialogState === LoginDialogState.ForgotPassword) {
                const email = formData.get("email") as string;
                handleForgotPassword(email);
            } else if (state.dialogState === LoginDialogState.ResetPassword) {
                handleResetPassword(formData.get("password") as string);
            } else {
                const password = formData.get("password") as string;

                if (state.dialogState === LoginDialogState.SignUp) {
                    if (!(await validatePassword(password))) return; // Validate password for signup
                }

                if (state.dialogState === LoginDialogState.SignUp) {
                    if (!(await verifyRecaptcha())) return; // Verify reCAPTCHA for signup
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

    /**
     * Handles user login by sending credentials to the authentication API.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     */
    const handleLogin = async (email: string, password: string): Promise<void> => {
        try {
            // Send login request to the API
            const response = await fetch("/api/auth/login", {
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                const { token } = await response.json(); // Extract authentication token from the response
                localStorage?.setItem("authToken", token); // Store the token locally
                onLoginSuccess(); // Trigger success callback
                onClose(); // Close the login dialog
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:loginFailed", { message: i18n(data.error) }),
                    status: data.status
                };
            }
        } catch (error) {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset(); // Reset signup reCAPTCHA on login failure
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

    /**
     * Handles user registration by sending signup details to the API.
     *
     * @param {string} username - The user's chosen username.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's chosen password.
     */
    const handleSignUp = async (username: string, email: string, password: string): Promise<void> => {
        try {
            // Send signup request to the API
            const response = await fetch("/api/auth/signup", {
                body: JSON.stringify({ email, password, username }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                // Show success message and transition to login state
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
                recaptchaRef.current.reset(); // Reset reCAPTCHA on signup failure
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

    /**
     * Validates the user's password based on predefined security rules.
     *
     * @param password - The password to validate.
     * @returns {Promise<boolean>} `true` if the password meets requirements, `false` otherwise.
     */
    const validatePassword = async (password: string): Promise<boolean> => {
        if (!PASSWORD_REGEX.test(password)) {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset(); // Reset reCAPTCHA if password validation fails
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

    /**
     * Verifies the reCAPTCHA token by sending it to the backend for validation.
     *
     * @returns {Promise<boolean>} `true` if the reCAPTCHA verification is successful, `false` otherwise.
     */
    const verifyRecaptcha = async (): Promise<boolean> => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset(); // Reset reCAPTCHA before verifying
        }

        // Ensure a valid reCAPTCHA token exists before proceeding
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

        // Send the reCAPTCHA token to the backend for validation
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

    /**
     * Handles the "Forgot Password" process by sending a password reset request to the API.
     *
     * @param {string} email - The user's email address.
     */
    const handleForgotPassword = async (email: string): Promise<void> => {
        // Send forgot password request to the API
        const response = await fetch("/api/auth/forgot-password", {
            body: JSON.stringify({ email }),
            headers: { "Content-Type": "application/json" },
            method: "POST"
        });
        if (response.ok) {
            // Transition to the Reset Password dialog
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
        } else {
            const data = await response.json();
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n(data.error),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    /**
     * Handles the "Reset Password" process by validating the new password input and sending it to the API.
     *
     * @param {string} newPassword - The new password entered by the user.
     */
    const handleResetPassword = async (newPassword: string): Promise<void> => {
        if (!(await validatePassword(newPassword))) return; // Validate password before proceeding

        try {
            // Send reset password request to the API
            const response = await fetch("/api/auth/reset-password", {
                body: JSON.stringify({ email: state.storedEmail, newPassword, otp: state.otpInput }),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.ok) {
                // Show success message and transition back to the login state
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
