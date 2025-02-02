import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Settings from "@components/Settings";
import LoginDialog from "@components/LoginDialog";
import AccountSidebar from "@components/AccountSidebar";
import { useAuth } from "@context/AuthContext";

/**
 * The header bar at the top of the page.
 */
const HeaderBar: React.FC = () => {
    const { t: i18n } = useTranslation();
    const { isAuthenticated, login, logout } = useAuth();
    const [state, setState] = useState({
        showSettings: false,
        showLoginDialog: false,
        showAccountSidebar: false
    });

    return (
        <header id="site-header" className="bg-gradient-to-tr from-gray-700 to-gray-800 text-white">
            <div id="header-container" className="flex items-center justify-between px-4 py-2">
                <div id="logo-container" className="text-lg font-bold space-x-2">
                    <Link href="/" id="site-logo-link" className="hover:text-gray-300 flex items-center">
                        <img id="site-logo" src="/images/logo.png" alt="Site Logo" className="h-10 w-auto" />
                        <span id="site-title" className="text-lg font-bold ml-2">
                            {i18n("common:siteTitle")}
                        </span>
                    </Link>
                </div>
                <div id="actions-container" className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                id="account-button"
                                className="p-2 rounded text"
                                onClick={() => {
                                    setState((prev) => ({
                                        ...prev,
                                        showAccountSidebar: true
                                    }));
                                }}
                            >
                                <FontAwesomeIcon icon={faUserCircle} className="text-gray-200 text-xl" />
                            </button>
                        </div>
                    ) : (
                        <button
                            id="login-button"
                            className="bg-gradient-to-br from-green-500 to-green-600 text-white py-2 px-4 rounded-full hover:from-green-600 hover:to-green-700"
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
                        className="p-2 rounded text"
                        onClick={() => {
                            setState((prev) => ({
                                ...prev,
                                showSettings: true
                            }));
                        }}
                    >
                        <FontAwesomeIcon icon={faCog} id="settings-icon" className="text-gray-200 text-xl" />
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
