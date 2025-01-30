import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import MessageDialog from "./MessageDialog";
import { useRouter } from "next/router";

interface AccountSidebarProps {
    onClose: () => void; // Close handler
    handleLogout: () => void; // Logout handler
}

interface DecodedToken {
    userId: string;
    username: string;
    email: string;
    exp: number;
}

/**
 * The settings overlay component.
 */
const AccountSidebar: React.FC<AccountSidebarProps> = ({ onClose, handleLogout }) => {
    const router = useRouter();
    const { t: i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const { resolvedTheme } = useTheme();
    const [username, setUsername] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [messageDialog, setMessageDialog] = useState({ isOpen: false, message: "", type: "success" });

    useEffect(() => {
        // Trigger the slide-in and dimming animation after mounting
        setIsVisible(true);

        // Decode the JWT to get the username
        const token = localStorage?.getItem("authToken"); // Replace with the actual key you're using for the token
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setUsername(decoded.username);
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage?.getItem("authToken");
            if (!token) {
                return;
            }

            const response = await fetch("/api/auth/delete-account", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setMessageDialog({
                    isOpen: true,
                    message: i18n("account:deleteSuccess"),
                    type: "success"
                });
                handleLogout(); // Log out after account deletion
            } else {
                const errorData = await response.json();
                console.error(errorData.message);
                setMessageDialog({
                    isOpen: true,
                    message: i18n("account:deleteFailed"),
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
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? "opacity-70" : "opacity-0"
                }`}
                onClick={() => {
                    // Trigger the slide-out and undimming animation before unmounting
                    setIsVisible(false);
                    setTimeout(onClose, 300); // Match the animation duration
                }}
            />
            {/* Settings panel */}
            <div
                id="settings-panel"
                className={`relative transform transition-transform duration-300 ease-in-out w-1/3 max-w-md h-full shadow-lg p-4 ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
            >
                <div id="settings-header" className="flex justify-between items-center mb-6 mr-5">
                    <h2 id="settings-title" className="text-xl font-bold">
                        {i18n("account:account")}
                    </h2>
                    <button
                        id="close-settings-btn"
                        onClick={() => {
                            // Trigger the slide-out and undimming animation before unmounting
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className="text-xl"
                    >
                        <FontAwesomeIcon icon={faChevronRight} size="lg" />
                    </button>
                </div>
                <div className="p-4 border-4 rounded-lg m-4">
                    {/* Username */}
                    <div className="text-center mb-2">
                        <h3 className="text-lg font-semibold">
                            {username ? (
                                <>
                                    <FontAwesomeIcon icon={faUserCircle} className="text-gray-200 text-xl mr-2" />
                                    {username}
                                </>
                            ) : (
                                "Loading..."
                            )}
                        </h3>
                    </div>
                    {/* Logout */}
                    <div className="mt-4 flex justify-center">
                        <button
                            id="logout-btn"
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(handleLogout, 300);
                            }}
                            className="w-3/4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded hover:from-red-600 hover:to-orange-600 transition-colors duration-300"
                        >
                            {i18n("account:logout")}
                        </button>
                    </div>
                </div>
                {/* Link to Created Playlists */}
                <div className="mt-4 flex justify-center">
                    <button
                        id="go-to-ai-generate-setlist-button"
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                            router.push("/user-playlists");
                        }}
                        className="px-12 py-5 bg-violet-500 text-white font-semibold rounded-full shadow-lg hover:bg-violet-600 focus:outline-none transition mt-4"
                    >
                        {i18n("userPlaylists:createdPlaylists")}
                    </button>
                </div>
                {/* Delete Account */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 flex justify-center">
                    <button
                        onClick={() => setShowConfirmation(true)}
                        className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-2 px-4 rounded hover:from-red-800 hover:to-red-600 transition-colors duration-300"
                    >
                        {i18n("account:deleteAccount")}
                    </button>
                </div>
                {/* Confirmation Modal */}
                {showConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div
                            className={`w-3/4 max-w-sm rounded-lg shadow-lg p-6 ${
                                resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                            }`}
                        >
                            <h2 className="text-xl font-bold mb-4">{i18n("common:areYouSure")}</h2>
                            <p className="mb-6">{i18n("account:permanentAction")}</p>
                            <div className="flex justify-between">
                                <button
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
                                >
                                    {i18n("account:yesDelete")}
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors duration-300"
                                >
                                    {i18n("common:cancel")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Dialog */}
            <MessageDialog
                isOpen={messageDialog.isOpen}
                message={messageDialog.message}
                type={messageDialog.type as "success" | "error"}
                onClose={() => setMessageDialog({ isOpen: false, message: "", type: "success" })}
            />
        </div>
    );
};

export default AccountSidebar;
