import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

/**
 * The header bar at the top of the page
 */
const HeaderBar: React.FC = () => {
    const { t: i18nCommon } = useTranslation("common");

    return (
        <header className="bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="text-lg font-bold space-x-2">
                    <Link href="/" className="hover:text-gray-300 flex items-center">
                        <img
                            src="/images/logo.png"
                            alt="Site Logo"
                            className="h-10 w-auto"
                        />
                        <span className="text-lg font-bold ml-2">{i18nCommon("siteTitle")}</span>
                    </Link>
                </div>
                <div className="">
                    <button className="p-2 rounded">
                        <FontAwesomeIcon icon={faCog} className="text-gray-200" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderBar;
