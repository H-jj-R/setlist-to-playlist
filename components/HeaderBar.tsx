import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Settings from "./Settings";
import LoginDialog from "./LoginDialog"; // Import the LoginDialog component

/**
 * The header bar at the top of the page.
 */
const HeaderBar: React.FC = () => {
    const { t: i18n } = useTranslation();
    const [showSettings, setShowSettings] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false); // State for showing login dialog

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
                    <button
                        id="login-button"
                        className="bg-gradient-to-br from-green-500 to-green-600 text-white py-2 px-4 rounded-full hover:from-green-600 hover:to-green-700"
                        onClick={() => setShowLoginDialog(true)}
                    >
                        {i18n("loginSignUp:loginSignUp")}
                    </button>
                    <button id="settings-button" className="p-2 rounded text" onClick={() => setShowSettings(true)}>
                        <FontAwesomeIcon icon={faCog} id="settings-icon" className="text-gray-200 text-xl" />
                    </button>
                </div>
            </div>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            {showLoginDialog && <LoginDialog onClose={() => setShowLoginDialog(false)} />}
        </header>
    );
};

export default HeaderBar;
