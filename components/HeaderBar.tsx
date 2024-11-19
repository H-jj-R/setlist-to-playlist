import Link from "next/link";
import React from "react";

const HeaderBar: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white">
            <div className="flex items-center justify-between px-4 py-2">
                <div className="text-lg font-bold">
                    <Link href="/" className="hover:text-gray-300">
                        Setlist to Playlist
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default HeaderBar;
