import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelope, faLock, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import MessageDialog from "@components/MessageDialog";

interface LoginDialogProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ onClose, onLoginSuccess }) => {
    const { t: i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [messageDialog, setMessageDialog] = useState({ isOpen: false, message: "", type: "success" });
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const RECAPTCHA_SITE_KEY = "6LeSO8MqAAAAAPZJW7-h7yrBqb_6er-gLbOEcsc-";
    const PASSWORD_REGEX: RegExp =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,32}$/;

    useEffect(() => {
        // Trigger the dimming animation after mounting
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(onClose, 200);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const handleClose = () => {
        setTimeout(() => setIsDialogVisible(false), 300);
        setIsVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (isForgotPassword) {
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
            setMessageDialog({
                isOpen: true,
                message: i18n("account:passwordResetEmailSent"),
                type: "success"
            });
            setIsForgotPassword(false);
            // }
        } else {
            const password = formData.get("password") as string;
            if (isSignUp) {
                // Password validation
                if (!PASSWORD_REGEX.test(password)) {
                    setPasswordError(i18n("account:passwordError"));
                    return;
                }
            }
            setPasswordError("");
            const email = formData.get("email") as string;

            if (isSignUp) {
                // Ensure the reCAPTCHA token exists
                if (!recaptchaToken) {
                    setMessageDialog({
                        isOpen: true,
                        message: i18n("account:recaptchaNotVerified"),
                        type: "error"
                    });
                    return;
                }

                // Verify reCAPTCHA token
                const recaptchaResponse = await fetch("/api/auth/verify-recaptcha", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token: recaptchaToken })
                });
                const { success } = await recaptchaResponse.json();
                if (!success) {
                    setMessageDialog({
                        isOpen: true,
                        message: i18n("account:recaptchaNotVerified"),
                        type: "error"
                    });
                    return;
                }
            }

            if (isSignUp) {
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
                setMessageDialog({
                    isOpen: true,
                    message: i18n("account:signUpSuccess"),
                    type: "success"
                });
                setIsSignUp(false); // Switch to login mode
            } else {
                const errorData = await response.json();
                setMessageDialog({
                    isOpen: true,
                    message: i18n("account:signUpFailed", { message: i18n(errorData.message) }),
                    type: "error"
                });
            }
        } catch (error) {
            console.error(error);
            setMessageDialog({
                isOpen: true,
                message: i18n("errors:unexpectedError"),
                type: "error"
            });
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
                localStorage.setItem("authToken", token);
                onLoginSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                setMessageDialog({
                    isOpen: true,
                    message: i18n("account:loginFailed", { message: errorData.message }),
                    type: "error"
                });
            }
        } catch (error) {
            console.error(error);
            setMessageDialog({
                isOpen: true,
                message: i18n("errors:unexpectedError"),
                type: "error"
            });
        }
    };

    return (
        isDialogVisible && (
            <>
                {/* Background Overlay */}
                <div
                    id="background-overlay"
                    className={`z-20 fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-200 ${
                        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onClick={handleClose}
                ></div>

                {/* Dialog Box */}
                <div
                    id="dialog-box"
                    className={`z-30 fixed inset-0 flex justify-center items-center transition-all duration-300 ease-in-out ${
                        isVisible ? "opacity-100" : "opacity-0"
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
                                {isSignUp
                                    ? i18n("account:signUp")
                                    : isForgotPassword
                                    ? i18n("account:forgotPasswordTitle")
                                    : i18n("account:login")}
                            </h2>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                {isSignUp && (
                                    <div className="relative">
                                        <input
                                            name="username"
                                            type="text"
                                            placeholder={i18n("account:username")}
                                            maxLength={24}
                                            required
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
                                        placeholder={i18n("account:email")}
                                        required
                                        className="px-4 py-3 border border-gray-300 rounded-lg text-lg w-full transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none pl-10"
                                    />
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 pl-1"
                                    />
                                </div>
                                {!isForgotPassword && (
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={passwordVisible ? "text" : "password"}
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
                                            onClick={() => setPasswordVisible((prev) => !prev)}
                                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-500 pr-2"
                                        >
                                            {passwordVisible ? i18n("common:hide") : i18n("common:show")}
                                        </button>
                                    </div>
                                )}
                                {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                                {!isSignUp && !isForgotPassword && (
                                    <div className="flex justify-center">
                                        <p
                                            className="inline-block text-md text-center cursor-pointer text-blue-500 hover:underline"
                                            onClick={() => setIsForgotPassword(true)}
                                        >
                                            {i18n("account:forgotPassword")}
                                        </p>
                                    </div>
                                )}
                                {isSignUp && (
                                    <div className="flex justify-center">
                                        <ReCAPTCHA
                                            sitekey={RECAPTCHA_SITE_KEY}
                                            onChange={(token) => setRecaptchaToken(token)}
                                            onExpired={() => setRecaptchaToken(null)}
                                        />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    {isSignUp
                                        ? i18n("account:signUp")
                                        : isForgotPassword
                                        ? i18n("account:resetPassword")
                                        : i18n("account:login")}
                                </button>
                            </form>
                            <div className="flex justify-center">
                                {isForgotPassword ? (
                                    <p
                                        className="inline-block text-md text-center mt-2 pt-2 cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => setIsForgotPassword(false)}
                                    >
                                        {i18n("account:backToLogin")}
                                    </p>
                                ) : (
                                    <p
                                        className="inline-block text-md text-center mt-2 pt-2 cursor-pointer text-blue-500 hover:underline"
                                        onClick={() => setIsSignUp(!isSignUp)}
                                    >
                                        {isSignUp ? i18n("account:alreadyHaveAccount") : i18n("account:noAccount")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Message Dialog */}
                <MessageDialog
                    isOpen={messageDialog.isOpen}
                    message={messageDialog.message}
                    type={messageDialog.type as "success" | "error"}
                    onClose={() => setMessageDialog({ isOpen: false, message: "", type: "success" })}
                />
            </>
        )
    );
};

export default LoginDialog;
