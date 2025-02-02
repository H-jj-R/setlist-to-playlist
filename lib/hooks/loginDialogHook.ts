import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoginDialogState } from "@constants/loginDialogState";
import { MessageDialogState } from "@constants/messageDialogState";

/**
 * Hook for data handling on the login dialog.
 */
export default function loginDialogHook(onClose: () => void, onLoginSuccess: () => void) {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        isVisible: false,
        isDialogVisible: true,
        passwordVisible: false,
        passwordError: null as string | null,
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success },
        recaptchaToken: null as string | null,
        dialogState: LoginDialogState.Login
    });

    const PASSWORD_REGEX: RegExp =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;

    useEffect(() => {
        // Trigger the dimming animation after mounting
        setState((prev) => ({
            ...prev,
            isVisible: true
        }));
    }, []);

    useEffect(() => {
        if (!state.isVisible) {
            const timer = setTimeout(onClose, 200);
            return () => clearTimeout(timer);
        }
    }, [state.isVisible, onClose]);

    const handleClose = () => {
        setTimeout(
            () =>
                setState((prev) => ({
                    ...prev,
                    isDialogVisible: false
                })),
            300
        );
        setState((prev) => ({
            ...prev,
            isVisible: false
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (state.dialogState === LoginDialogState.ForgotPassword) {
            const email = formData.get("email") as string;
            // TODO: Forgot Password

            // const response = await fetch("/api/auth/forgot-password", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ email })
            // });

            // if (!response.ok) {
            //     const data = await response.json();
            //     setMessageDialog({
            //         isOpen: true,
            //         message: i18n(data.error),
            //         type: "error"
            //     });
            // } else {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("account:passwordResetEmailSent"),
                    type: MessageDialogState.Success
                },
                dialogState: LoginDialogState.Login
            }));
            // }
        } else {
            const password = formData.get("password") as string;
            if (state.dialogState === LoginDialogState.SignUp) {
                // Password validation
                if (!PASSWORD_REGEX.test(password)) {
                    setState((prev) => ({
                        ...prev,
                        passwordError: i18n("account:passwordError")
                    }));
                    return;
                }
            }
            setState((prev) => ({
                ...prev,
                passwordError: null
            }));
            const email = formData.get("email") as string;

            if (state.dialogState === LoginDialogState.SignUp) {
                // Ensure the reCAPTCHA token exists
                if (!state.recaptchaToken) {
                    setState((prev) => ({
                        ...prev,
                        messageDialog: {
                            isOpen: true,
                            message: i18n("account:recaptchaNotVerified"),
                            type: MessageDialogState.Error
                        }
                    }));
                    return;
                }

                // Verify reCAPTCHA token
                const recaptchaResponse = await fetch("/api/auth/verify-recaptcha", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token: state.recaptchaToken })
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
                    return;
                }
            }

            if (state.dialogState === LoginDialogState.SignUp) {
                const username = formData.get("username") as string;
                await handleSignUp(username, email, password);
            } else {
                await handleLogin(email, password);
            }
        }
    };

    const handleSignUp = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:signUpSuccess"),
                        type: MessageDialogState.Success
                    },
                    dialogState: LoginDialogState.Login
                }));
            } else {
                const errorData = await response.json();
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:signUpFailed", { message: i18n(errorData.message) }),
                        type: MessageDialogState.Error
                    }
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("errors:unexpectedError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage?.setItem("authToken", token);
                onLoginSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:loginFailed", { message: errorData.error }),
                        type: MessageDialogState.Error
                    }
                }));
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                messageDialog: {
                    isOpen: true,
                    message: i18n("errors:unexpectedError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    return {
        state,
        setState,
        handleClose,
        handleSubmit
    };
}
