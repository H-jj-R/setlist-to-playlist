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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * **HeaderBar Component**
 *
 * The main header bar displayed at the top of the page.
 *
 * @returns The rendered `HeaderBar` component.
 */
const HeaderBar: React.FC<{}> = () => {
    const { isAuthenticated, login, logout } = useAuth(); // Authentication context
    const { t: i18n } = useTranslation(); // Translation hook
    const [state, setState] = useState({
        showAccountSidebar: false, // Controls visibility of the account sidebar
        showLoginDialog: false, // Controls visibility of the login dialog
        showSettings: false // Controls visibility of the settings modal
    });

    return (
        <header id="site-header" className="bg-linear-to-tr from-gray-700 to-gray-800 text-white">
            <div
                id="header-container"
                className="flex items-center justify-between overflow-hidden px-4 py-2 whitespace-nowrap"
            >
                <div id="logo-container" className="space-x-2 text-lg font-bold">
                    <Link id="site-logo-link" className="flex items-center transition hover:text-gray-300" href="/">
                        <Image
                            id="site-logo"
                            className="h-10 w-auto"
                            alt={i18n("common:siteLogo")}
                            height={900}
                            src="/images/logo.png"
                            width={900}
                        />
                        <span id="site-title" className="ml-2 text-lg font-bold">
                            Setlist to Playlist
                        </span>
                    </Link>
                </div>
                <div id="actions-container" className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <div id="account-btn-container" className="relative">
                            <button
                                id="account-btn"
                                className="text rounded-sm p-2 transition hover:cursor-pointer"
                                onClick={(): void => {
                                    setState((prev) => ({ ...prev, showAccountSidebar: true }));
                                }}
                            >
                                <FontAwesomeIcon
                                    id="fa-user-circle-icon"
                                    className="text-xl text-gray-200"
                                    icon={faUserCircle}
                                />
                            </button>
                        </div>
                    ) : (
                        <button
                            id="login-btn"
                            className="rounded-full bg-linear-to-br from-green-500 to-green-600 px-4 py-2 text-white transition hover:cursor-pointer hover:from-green-600 hover:to-green-700"
                            onClick={(): void => {
                                setState((prev) => ({ ...prev, showLoginDialog: true }));
                            }}
                        >
                            {i18n("account:loginSignUp")}
                        </button>
                    )}
                    <button
                        id="settings-btn"
                        className="text rounded-sm pr-2 transition hover:cursor-pointer sm:pl-4"
                        onClick={(): void => {
                            setState((prev) => ({ ...prev, showSettings: true }));
                        }}
                    >
                        <FontAwesomeIcon id="fa-cog-icon" className="text-xl text-gray-200" icon={faCog} />
                    </button>
                </div>
            </div>
            {state.showSettings && (
                <Settings
                    onClose={(): void => {
                        setState((prev) => ({ ...prev, showSettings: false }));
                    }}
                />
            )}
            {state.showAccountSidebar && (
                <AccountSidebar
                    handleLogout={(): void => {
                        logout();
                        setState((prev) => ({ ...prev, showAccountSidebar: false }));
                    }}
                    onClose={(): void => {
                        setState((prev) => ({ ...prev, showAccountSidebar: false }));
                    }}
                />
            )}
            {state.showLoginDialog && (
                <LoginDialog
                    onClose={(): void => {
                        setState((prev) => ({ ...prev, showLoginDialog: false }));
                    }}
                    onLoginSuccess={login}
                />
            )}
        </header>
    );
};

export default HeaderBar;
