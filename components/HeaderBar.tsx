import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

/**
 * The header bar at the top of the page
 */
const HeaderBar: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="text-lg font-bold">
                    <Link href="/" className="hover:text-gray-300">
                        Setlist to Playlist
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
