import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

interface SettingsProps {
    onClose: () => void; // Close handler
}

/**
 * The settings overlay component.
 */
const Settings: React.FC<SettingsProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        // Trigger the slide-in and dimming animation after mounting
        setIsVisible(true);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? "opacity-70" : "opacity-0"
                }`}
                onClick={() => {
                    // Trigger the slide-out and undimming animation before unmounting
                    setIsVisible(false);
                    setTimeout(onClose, 300); // Match the animation duration
                }}
            />
            {/* Settings panel */}
            <div
                id="settings-panel"
                className={`transform transition-transform duration-300 ease-in-out w-1/3 max-w-md h-full shadow-lg p-4 ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
            >
                <div id="settings-header" className="flex justify-between items-center mb-4 mr-5">
                    <h2 id="settings-title" className="text-xl font-bold">
                        Settings
                    </h2>
                    <button
                        id="close-settings-btn"
                        onClick={() => {
                            // Trigger the slide-out and undimming animation before unmounting
                            setIsVisible(false);
                            setTimeout(onClose, 300); // Match the animation duration
                        }}
                        className="text-xl"
                    >
                        <FontAwesomeIcon icon={faChevronRight} size="lg" />
                    </button>
                </div>
                {/* Theme Setting */}
                <div id="theme-setting" className="mb-4">
                    <h3 id="theme-title" className="text-lg font-medium">
                        Theme
                    </h3>
                    <select
                        id="theme-select"
                        value={theme}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            setTheme(event.target.value);
                        }}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                            resolvedTheme === "dark"
                                ? "border-gray-600 bg-gray-700 text-gray-200 focus:ring-blue-500"
                                : "border-gray-400 bg-white text-gray-800 focus:ring-blue-500"
                        }`}
                    >
                        <option id="light-theme" value="light">
                            Light
                        </option>
                        <option id="dark-theme" value="dark">
                            Dark
                        </option>
                        <option id="system-theme" value="system">
                            System
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
