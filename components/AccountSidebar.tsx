import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserCircle, faRightFromBracket, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "@components/ConfirmationModal";
import MessageDialog from "@components/MessageDialog";
import { MessageDialogState } from "@constants/messageDialogState";

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
 * The account sidebar overlay component.
 */
const AccountSidebar: React.FC<AccountSidebarProps> = ({ onClose, handleLogout }) => {
    const router = useRouter();
    const { t: i18n } = useTranslation();
    const { resolvedTheme } = useTheme();
    const [state, setState] = useState({
        isVisible: false,
        username: null as string | null,
        showConfirmation: false,
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
    });

    useEffect(() => {
        // Trigger the slide-in and dimming animation after mounting
        setState((prev) => ({
            ...prev,
            isVisible: true
        }));

        // Decode the JWT to get the username
        const token = localStorage?.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setState((prev) => ({
                    ...prev,
                    username: decoded.username
                }));
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
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:deleteSuccess"),
                        type: MessageDialogState.Success
                    }
                }));
                handleLogout(); // Log out after account deletion
            } else {
                setState((prev) => ({
                    ...prev,
                    messageDialog: {
                        isOpen: true,
                        message: i18n("account:deleteFailed"),
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

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    state.isVisible ? "opacity-70" : "opacity-0"
                }`}
                onClick={() => {
                    setState((prev) => ({
                        ...prev,
                        isVisible: false
                    }));
                    setTimeout(onClose, 300);
                }}
            />
            {/* Settings panel */}
            <div
                id="settings-panel"
                className={`relative transform transition-transform duration-300 ease-in-out w-1/3 max-w-md h-full shadow-lg p-4 ${
                    state.isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
            >
                <div id="settings-header" className="flex justify-between items-center mb-6 mr-5">
                    <h2 id="settings-title" className="text-xl font-bold">
                        {i18n("account:account")}
                    </h2>
                    <button
                        id="close-settings-btn"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                isVisible: false
                            }));
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
                            {state.username ? (
                                <>
                                    <FontAwesomeIcon icon={faUserCircle} className="text-gray-200 text-xl mr-2" />
                                    {state.username}
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
                                setState((prev) => ({
                                    ...prev,
                                    isVisible: false
                                }));
                                setTimeout(handleLogout, 300);
                            }}
                            className="w-3/4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded hover:from-red-600 hover:to-orange-600 transition-colors duration-300"
                        >
                            <FontAwesomeIcon icon={faRightFromBracket} className="text-gray-200 text-l mr-2" />
                            {i18n("account:logout")}
                        </button>
                    </div>
                </div>
                {/* Link to Created Playlists */}
                <div className="mt-4 flex justify-center">
                    <button
                        id="go-to-ai-generate-setlist-button"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                isVisible: false
                            }));
                            setTimeout(onClose, 300);
                            router.push("/user-playlists");
                        }}
                        className="px-2 py-5 w-3/4 bg-violet-500 text-white font-semibold rounded-md shadow-lg hover:bg-violet-600 focus:outline-none transition mt-4"
                    >
                        {i18n("userPlaylists:createdPlaylists")}
                    </button>
                </div>
                {/* Delete Account */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 flex justify-center">
                    <button
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                showConfirmation: true
                            }));
                        }}
                        className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-2 px-4 rounded hover:from-red-800 hover:to-red-600 transition-colors duration-300"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-gray-200 text-l mr-2" />
                        {i18n("account:deleteAccount")}
                    </button>
                </div>
                {/* Confirmation Modal */}
                {state.showConfirmation && (
                    <ConfirmationModal
                        onConfirm={handleDeleteAccount}
                        onCancel={() => {
                            setState((prev) => ({
                                ...prev,
                                showConfirmation: false
                            }));
                        }}
                    ></ConfirmationModal>
                )}
            </div>

            {/* Message Dialog */}
            {state.messageDialog.isOpen && (
                <MessageDialog
                    message={state.messageDialog.message}
                    type={state.messageDialog.type}
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
                        }));
                    }}
                />
            )}
        </div>
    );
};

export default AccountSidebar;
