/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import ConfirmationModal from "@components/Dialogs/ConfirmationModal";
import MessageDialog from "@components/Dialogs/MessageDialog";
import MessageDialogState from "@constants/messageDialogState";
import { faChevronRight, faRightFromBracket, faTrash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AccountSidebarProps {
    handleLogout: () => void; // Logout handler
    onClose: () => void; // Close handler
}

interface DecodedToken {
    email: string;
    exp: number;
    userId: string;
    username: string;
}

/**
 * The account sidebar overlay component.
 */
const AccountSidebar: React.FC<AccountSidebarProps> = ({ handleLogout, onClose }): JSX.Element => {
    const { resolvedTheme } = useTheme();
    const router = useRouter();
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        email: null as null | string,
        isVisible: false,
        messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success },
        showConfirmation: false,
        username: null as null | string
    });

    useEffect((): void => {
        // Trigger the slide-in and dimming animation after mounting
        setState((prev) => ({ ...prev, isVisible: true }));

        // Decode the JWT to get the username
        const token = localStorage?.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                setState((prev) => ({ ...prev, email: decoded.email, username: decoded.username }));
            } catch (error) {
                console.error(error);
            }
        }
    }, []);

    useEffect((): void => {
        if (state.isVisible) {
            document.getElementById("account-settings-panel")?.focus();
        }
    }, [state.isVisible]);

    const handleDeleteAccount = useCallback(async (): Promise<void> => {
        try {
            const token = localStorage?.getItem("authToken");
            if (!token) return;

            const response = await fetch("/api/auth/delete-account", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                method: "DELETE"
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
                throw {
                    error: i18n("account:deleteFailed"),
                    status: response.status
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
    }, [handleLogout]);

    return (
        <div id="account-settings-container" className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="account-settings-background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    state.isVisible ? "opacity-70" : "opacity-0"
                }`}
                aria-hidden={state.isVisible ? "false" : "true"}
                onClick={(): void => {
                    setState((prev) => ({ ...prev, isVisible: false }));
                    setTimeout(onClose, 300);
                }}
            />
            {/* Settings panel */}
            <div
                id="account-settings-panel"
                className={`relative h-full w-1/3 max-w-md transform p-4 shadow-lg transition-transform duration-300 ease-in-out ${
                    state.isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
                aria-live="assertive"
                tabIndex={-1}
            >
                <div id="account-settings-header" className="mb-6 mr-5 flex items-center justify-between">
                    <h2 id="account-settings-header-title" className="text-xl font-bold">
                        {i18n("account:account")}
                    </h2>
                    <button
                        id="account-settings-close-btn"
                        className="text-xl"
                        aria-label={i18n("account:closeAccountSettings")}
                        onClick={(): void => {
                            setState((prev) => ({ ...prev, isVisible: false }));
                            setTimeout(onClose, 300);
                        }}
                    >
                        <FontAwesomeIcon id="fa-chevron-right-icon" icon={faChevronRight} size="lg" />
                    </button>
                </div>
                <div id="account-settings-details-container" className="m-4 rounded-lg border-4 p-4">
                    {/* Username & Email */}
                    <div id="account-settings-username-email-container" className="mb-2 text-center">
                        <h3 id="account-settings-username-email-header" className="text-lg font-semibold">
                            {state.username && state.email ? (
                                <>
                                    <div id="account-settings-username">
                                        <FontAwesomeIcon
                                            id="fa-user-circle-icon"
                                            className="mr-2 text-xl text-gray-200"
                                            icon={faUserCircle}
                                        />
                                        {state.username}
                                    </div>
                                    <div id="account-settings-email" className="pt-2 text-sm">
                                        {state.email}
                                    </div>
                                </>
                            ) : (
                                <span id="loading-text" aria-busy="true">
                                    `${i18n("common:loading")}...`
                                </span>
                            )}
                        </h3>
                    </div>
                    {/* Logout */}
                    <div id="account-settings-logout-container" className="mt-4 flex justify-center">
                        <button
                            id="account-settings-logout-btn"
                            className="w-3/4 rounded bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-white transition-colors duration-300 hover:from-red-600 hover:to-orange-600"
                            aria-label={i18n("account:logout")}
                            onClick={(): void => {
                                setState((prev) => ({ ...prev, isVisible: false }));
                                setTimeout(handleLogout, 300);
                            }}
                        >
                            <FontAwesomeIcon
                                id="fa-right-from-bracket-icon"
                                className="text-l mr-2 text-gray-200"
                                icon={faRightFromBracket}
                            />
                            {i18n("account:logout")}
                        </button>
                    </div>
                </div>
                {/* Link to Created Playlists */}
                <div id="account-settings-playlists-container" className="mt-4 flex justify-center">
                    <button
                        id="account-settings-go-to-created-playlists-btn"
                        className="mt-4 w-3/4 rounded-md bg-violet-500 px-2 py-5 font-semibold text-white shadow-lg transition hover:bg-violet-600 focus:outline-none"
                        aria-label={i18n("userPlaylists:createdPlaylists")}
                        onClick={(): void => {
                            setState((prev) => ({ ...prev, isVisible: false }));
                            setTimeout(onClose, 300);
                            router.push("/user-playlists");
                        }}
                    >
                        {i18n("userPlaylists:createdPlaylists")}
                    </button>
                </div>
                {/* Delete Account */}
                <div
                    id="account-settings-delete-account-container"
                    className="absolute bottom-4 left-1/2 flex w-3/4 -translate-x-1/2 transform justify-center"
                >
                    <button
                        id="account-settings-delete-account-btn"
                        className="w-full rounded bg-gradient-to-r from-red-700 to-red-500 px-4 py-2 text-white transition-colors duration-300 hover:from-red-800 hover:to-red-600"
                        aria-label={i18n("account:deleteAccount")}
                        onClick={(): void => {
                            setState((prev) => ({ ...prev, showConfirmation: true }));
                        }}
                    >
                        <FontAwesomeIcon id="fa-trash-icon" className="text-l mr-2 text-gray-200" icon={faTrash} />
                        {i18n("account:deleteAccount")}
                    </button>
                </div>
                {/* Confirmation Modal */}
                {state.showConfirmation && (
                    <ConfirmationModal
                        aria-live="assertive"
                        onCancel={(): void => {
                            setState((prev) => ({ ...prev, showConfirmation: false }));
                        }}
                        onConfirm={handleDeleteAccount}
                    />
                )}
            </div>

            {/* Message Dialog */}
            {state.messageDialog.isOpen && (
                <MessageDialog
                    aria-live="assertive"
                    message={state.messageDialog.message}
                    onClose={(): void => {
                        setState((prev) => ({
                            ...prev,
                            messageDialog: { isOpen: false, message: "", type: MessageDialogState.Success }
                        }));
                    }}
                    type={state.messageDialog.type}
                />
            )}
        </div>
    );
};

export default AccountSidebar;
