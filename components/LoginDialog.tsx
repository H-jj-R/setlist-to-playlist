import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface LoginDialogProps {
    onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);

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
        setIsDialogVisible(false);
        setIsVisible(false);
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
                            aria-label="Close"
                        >
                            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                        </button>

                        {/* Login/Sign Up Form */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                                {isSignUp ? "Sign Up" : "Login"}
                            </h2>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    // Call backend API here
                                }}
                            >
                                {isSignUp && (
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        required
                                        className="px-4 py-3 border border-gray-300 rounded-lg text-lg transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                    />
                                )}
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-lg transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="px-4 py-3 border border-gray-300 rounded-lg text-lg transition duration-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-3 rounded-lg text-lg transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    {isSignUp ? "Sign Up" : "Login"}
                                </button>
                            </form>
                            <p
                                className="text-sm text-center mt-2 pt-2 cursor-pointer text-blue-500 hover:underline"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp ? "Already have an account? Login" : "No account? Sign up"}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    );
};

export default LoginDialog;
