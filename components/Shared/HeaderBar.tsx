/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import AccountSidebar from "@components/Account/AccountSidebar";
import LoginDialog from "@components/Dialogs/LoginDialog";
import Settings from "@components/Shared/Settings";
import { useAuth } from "@context/AuthContext";
import { faCog, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * The header bar at the top of the page.
 */
const HeaderBar: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        showSettings: false,
        showLoginDialog: false,
        showAccountSidebar: false
    });

    return (
        <header id="site-header" className="bg-gradient-to-tr from-gray-700 to-gray-800 text-white">
            <div id="header-container" className="flex items-center justify-between px-4 py-2">
                <div id="logo-container" className="space-x-2 text-lg font-bold">
                    <Link href="/" id="site-logo-link" className="flex items-center hover:text-gray-300">
                        <img id="site-logo" src="/images/logo.png" alt="Site Logo" className="h-10 w-auto" />
                        <span id="site-title" className="ml-2 text-lg font-bold">
                            Setlist to Playlist
                        </span>
                    </Link>
                </div>
                <div id="actions-container" className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                id="account-button"
                                className="text rounded p-2"
                                onClick={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        showAccountSidebar: true
                                    }));
                                }}
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="text-xl text-gray-200" />
                            </button>
                        </div>
                    ) : (
                        <button
                            id="login-button"
                            className="rounded-full bg-gradient-to-br from-green-500 to-green-600 px-4 py-2 text-white hover:from-green-600 hover:to-green-700"
                            onClick={() => {
                                setState((prev) => ({
                                    ...prev,
                                    showLoginDialog: true
                                }));
                            }}
                        >
                            {i18n("account:loginSignUp")}
                        </button>
                    )}
                    <button
                        id="settings-button"
                        className="text rounded p-2"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                showSettings: true
                            }));
                        }}
                    >
                        <FontAwesomeIcon icon={faCog} id="settings-icon" className="text-xl text-gray-200" />
                    </button>
                </div>
            </div>
            {state.showSettings && (
                <Settings
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            showSettings: false
                        }));
                    }}
                />
            )}
            {state.showAccountSidebar && (
                <AccountSidebar
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            showAccountSidebar: false
                        }));
                    }}
                    handleLogout={() => {
                        logout();
                        setState((prev) => ({
                            ...prev,
                            showAccountSidebar: false
                        }));
                    }}
                />
            )}
            {state.showLoginDialog && (
                <LoginDialog
                    onClose={() => {
                        setState((prev) => ({
                            ...prev,
                            showLoginDialog: false
                        }));
                    }}
                    onLoginSuccess={login}
                />
            )}
        </header>
    );
};

export default HeaderBar;
