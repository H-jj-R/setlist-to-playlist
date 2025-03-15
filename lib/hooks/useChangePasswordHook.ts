/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import MessageDialogState from "@constants/messageDialogState";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **useChangePasswordHook**
 *
 * Custom hook for handling data and state management in the `ChangePasswordDialog` component.
 *
 * @param {string} email - Email of currently logged in user.
 * @param {Function} onClose - Function to execute when the dialog is closed.
 *
 * @returns Hook state and handlers.
 */
export default function useChangePasswordHook(email: string, onClose: () => void) {
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        isDialogVisible: true, // Controls the visibility of the dialog
        isVisible: false, // Controls the animation of the dialog
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }, // Controls status messages
        newPasswordVisible: false, // Tracks new password visibility
        passwordError: null as null | string, // Stores password validation errors
        passwordVisible: false // Tracks password visibility
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
     * Closes the dialog with a fade-out animation.
     */
    const handleClose = (): void => {
        setTimeout((): void => setState((prev) => ({ ...prev, isDialogVisible: false })), 300);
        setState((prev) => ({ ...prev, isVisible: false }));
    };

    /**
     * Handles form submission for login, signup, and password reset.
     * Determines the current authentication state and processes the request accordingly.
     *
     * @param {React.FormEvent} e - The form submit event.
     */
    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
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
        const newPassword = formData.get("newPassword") as string;
        if (!(await validatePassword(newPassword))) return;
        const currentPassword = formData.get("password") as string;
        if (!(await checkCorrectpassword(currentPassword))) return;
        handleChangePassword(newPassword);
    };

    /**
     * Validates the user's password based on predefined security rules.
     *
     * @param password - The password to validate.
     * @returns {Promise<boolean>} `true` if the password meets requirements, `false` otherwise.
     */
    const validatePassword = async (password: string): Promise<boolean> => {
        if (!PASSWORD_REGEX.test(password)) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: false,
                    message: "",
                    type: MessageDialogState.Success
                },
                passwordError: i18n("account:passwordError")
            }));
            return false;
        }
        setState((prev) => ({ ...prev, passwordError: null }));
        return true;
    };

    /**
     * Checks whether the user's entered current password is correct.
     *
     * @param password - The entered password.
     * @returns {Promise<boolean>} `true` if the password is correct, `false` otherwise.
     */
    const checkCorrectpassword = async (password: string): Promise<boolean> => {
        try {
            // Send login request to the API
            const response = await fetch("/api/auth/verify-correct-password", {
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
                method: "POST"
            });

            if (response.ok) {
                return true;
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:changePasswordFailed", { message: i18n(data.error) }),
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
            return false;
        }
    };

    /**
     * Send the new password to the backend API route to be changed in the database.
     *
     * @param {string} newPassword - The new password to be updated
     */
    const handleChangePassword = async (newPassword: string): Promise<void> => {
        try {
            // Send reset password request to the API
            const response = await fetch("/api/auth/change-password", {
                body: JSON.stringify({ email: email, newPassword }),
                headers: { "Content-Type": "application/json" },
                method: "POST"
            });

            if (response.ok) {
                // Show success message
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:changePasswordSuccess"),
                        type: MessageDialogState.Success
                    },
                    storedEmail: null
                }));
            } else {
                const data = await response.json();
                throw {
                    error: i18n("account:changePasswordFailed", { message: i18n(data.error) }),
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
        setState,
        state
    };
}
