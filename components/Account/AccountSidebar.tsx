/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserCircle, faRightFromBracket, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "@components/Dialogs/ConfirmationModal";
import MessageDialog from "@components/Dialogs/MessageDialog";
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
        email: null as string | null,
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
                    username: decoded.username,
                    email: decoded.email
                }));
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    useEffect(() => {
        if (state.isVisible) {
            document.getElementById("account-settings-panel")?.focus();
        }
    }, [state.isVisible]);

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
                    message: i18n("common:unexpectedError"),
                    type: MessageDialogState.Error
                }
            }));
        }
    };

    return (
        <div id="account-settings-container" className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="account-settings-background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    state.isVisible ? "opacity-70" : "opacity-0"
                }`}
                onClick={() => {
                    setState((prev) => ({ ...prev, isVisible: false }));
                    setTimeout(onClose, 300);
                }}
                aria-hidden={state.isVisible ? "false" : "true"}
            />
            {/* Settings panel */}
            <div
                id="account-settings-panel"
                tabIndex={-1}
                className={`relative transform transition-transform duration-300 ease-in-out w-1/3 max-w-md h-full shadow-lg p-4 ${
                    state.isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
                aria-live="assertive"
            >
                <div id="account-settings-header" className="flex justify-between items-center mb-6 mr-5">
                    <h2 id="account-settings-header-title" className="text-xl font-bold">
                        {i18n("account:account")}
                    </h2>
                    <button
                        id="account-settings-close-btn"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                isVisible: false
                            }));
                            setTimeout(onClose, 300);
                        }}
                        className="text-xl"
                        aria-label={i18n("account:closeAccountSettings")}
                    >
                        <FontAwesomeIcon id="fa-chevron-right-icon" icon={faChevronRight} size="lg" />
                    </button>
                </div>
                <div id="account-settings-details-container" className="p-4 border-4 rounded-lg m-4">
                    {/* Username & Email */}
                    <div id="account-settings-username-email-container" className="text-center mb-2">
                        <h3 id="account-settings-username-email-header" className="text-lg font-semibold">
                            {state.username && state.email ? (
                                <>
                                    <div id="account-settings-username">
                                        <FontAwesomeIcon
                                            id="fa-user-circle-icon"
                                            icon={faUserCircle}
                                            className="text-gray-200 text-xl mr-2"
                                        />
                                        {state.username}
                                    </div>
                                    <div id="account-settings-email" className="text-sm pt-2">
                                        {state.email}
                                    </div>
                                </>
                            ) : (
                                <span aria-busy="true">`${i18n("common:loading")}...`</span>
                            )}
                        </h3>
                    </div>
                    {/* Logout */}
                    <div id="account-settings-logout-container" className="mt-4 flex justify-center">
                        <button
                            id="account-settings-logout-btn"
                            onClick={() => {
                                setState((prev) => ({ ...prev, isVisible: false }));
                                setTimeout(handleLogout, 300);
                            }}
                            className="w-3/4 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-4 rounded hover:from-red-600 hover:to-orange-600 transition-colors duration-300"
                            aria-label={i18n("account:logout")}
                        >
                            <FontAwesomeIcon
                                id="fa-right-from-bracket-icon"
                                icon={faRightFromBracket}
                                className="text-gray-200 text-l mr-2"
                            />
                            {i18n("account:logout")}
                        </button>
                    </div>
                </div>
                {/* Link to Created Playlists */}
                <div id="account-settings-playlists-container" className="mt-4 flex justify-center">
                    <button
                        id="account-settings-go-to-created-playlists-button"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                isVisible: false
                            }));
                            setTimeout(onClose, 300);
                            router.push("/user-playlists");
                        }}
                        className="px-2 py-5 w-3/4 bg-violet-500 text-white font-semibold rounded-md shadow-lg hover:bg-violet-600 focus:outline-none transition mt-4"
                        aria-label={i18n("userPlaylists:createdPlaylists")}
                    >
                        {i18n("userPlaylists:createdPlaylists")}
                    </button>
                </div>
                {/* Delete Account */}
                <div
                    id="account-settings-delete-account-container"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 flex justify-center"
                >
                    <button
                        id="account-settings-delete-account-btn"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                showConfirmation: true
                            }));
                        }}
                        className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-2 px-4 rounded hover:from-red-800 hover:to-red-600 transition-colors duration-300"
                        aria-label={i18n("account:deleteAccount")}
                    >
                        <FontAwesomeIcon id="fa-trash-icon" icon={faTrash} className="text-gray-200 text-l mr-2" />
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
                        aria-live="assertive"
                    />
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
                    aria-live="assertive"
                />
            )}
        </div>
    );
};

export default AccountSidebar;
