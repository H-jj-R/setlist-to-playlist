import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Settings from "./Settings";

/**
 * The header bar at the top of the page.
 */
const HeaderBar: React.FC = () => {
    const { t: i18nCommon } = useTranslation("common");
    const [showSettings, setShowSettings] = useState(false);

    return (
        <header className="bg-gradient-to-tr from-gray-700 to-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="text-lg font-bold space-x-2">
                    <Link href="/" className="hover:text-gray-300 flex items-center">
                        <img src="/images/logo.png" alt="Site Logo" className="h-10 w-auto" />
                        <span className="text-lg font-bold ml-2">{i18nCommon("siteTitle")}</span>
                    </Link>
                </div>
                <div>
                    <button
                        className="p-2 rounded text"
                        onClick={() => setShowSettings(true)}
                    >
                        <FontAwesomeIcon icon={faCog} className="text-gray-200 text-xl" />
                    </button>
                </div>
            </div>
            {showSettings && (
                <Settings onClose={() => setShowSettings(false)} />
            )}
        </header>
    );
};

export default HeaderBar;
