/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import countryCodes from "@constants/countryCodes";
import SettingsKeys from "@constants/settingsKeys";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SettingsProps {
    onClose: () => void; // Close handler
}

/**
 * The settings overlay component.
 */
const Settings: React.FC<SettingsProps> = ({ onClose }): JSX.Element => {
    const { resolvedTheme, setTheme, theme } = useTheme();
    const { t: i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState(() => ({
        countryFilter: (localStorage?.getItem(SettingsKeys.CountryFilter) as string) ?? "",
        excludeCovers: localStorage?.getItem(SettingsKeys.ExcludeCovers) === "true",
        excludeDuplicateSongs: localStorage?.getItem(SettingsKeys.ExcludeDuplicateSongs) === "true",
        excludePlayedOnTape: localStorage?.getItem(SettingsKeys.ExcludePlayedOnTape) === "true",
        hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true",
        hideSongsNotFound: localStorage?.getItem(SettingsKeys.HideSongsNotFound) === "true"
    }));

    const handleSettingChange = useCallback(
        (key: keyof typeof settings) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
                const value: boolean | string =
                    event.target.type === "checkbox" ? event.target.checked : event.target.value;
                setSettings((prev) => ({ ...prev, [key]: value }));
                localStorage?.setItem(key, value.toString());
                window.dispatchEvent(new StorageEvent(key));
            },
        []
    );

    useEffect(() => {
        // Trigger the slide-in and dimming animation after mounting
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (isVisible) {
            document.getElementById("settings-panel")?.focus();
        }
    }, [isVisible]);

    return (
        <div id="settings-sidebar" className="fixed inset-0 z-50 flex justify-end">
            {/* Background overlay with opacity animation */}
            <div
                id="background-overlay"
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? "opacity-70" : "opacity-0"
                }`}
                onClick={(): void => {
                    // Trigger the slide-out and undimming animation before unmounting
                    setIsVisible(false);
                    setTimeout(onClose, 300); // Match the animation duration
                }}
            />
            {/* Settings panel */}
            <div
                id="settings-panel"
                className={`h-full w-2/5 max-w-md transform p-4 shadow-lg transition-transform duration-300 ease-in-out ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                } ${resolvedTheme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}
            >
                <div id="settings-header" className="mb-6 mr-5 flex items-center justify-between">
                    <h2 id="settings-title" className="text-xl font-bold">
                        {i18n("settings:settingsTitle")}
                    </h2>
                    <button
                        id="close-settings-btn"
                        className="text-xl"
                        onClick={(): void => {
                            // Trigger the slide-out and undimming animation before unmounting
                            setIsVisible(false);
                            setTimeout(onClose, 300); // Match the animation duration
                        }}
                    >
                        <FontAwesomeIcon id="fa-chevron-right-icon" icon={faChevronRight} size="lg" />
                    </button>
                </div>
                {/* Theme Setting */}
                <div id="theme-setting" className="mb-4">
                    <h3 id="theme-title" className="text-lg font-medium">
                        {i18n("settings:themeTitle")}
                    </h3>
                    <label id="theme-label" className="flex items-center space-x-2 p-2">
                        <select
                            id="theme-select"
                            className={`w-full cursor-pointer rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                resolvedTheme === "dark"
                                    ? "border-gray-600 bg-gray-700 text-gray-200"
                                    : "border-gray-400 bg-white text-gray-800"
                            }`}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                setTheme(event.target.value);
                            }}
                            value={theme}
                        >
                            <option id="light-theme" value="light">
                                {i18n("settings:lightTheme")}
                            </option>
                            <option id="dark-theme" value="dark">
                                {i18n("settings:darkTheme")}
                            </option>
                            <option id="system-theme" value="system">
                                {i18n("settings:systemTheme")}
                            </option>
                        </select>
                    </label>
                </div>
                {/* Setlists Settings */}
                <div id="setlists-settings" className="mb-4">
                    <h3 id="setlists-title" className="text-lg font-medium">
                        {i18n("settings:setlistsTitle")}
                    </h3>
                    <label id="hide-empty-setlists" className="flex items-center space-x-2 p-2">
                        <input
                            id="hide-empty-setlists-checkbox"
                            className="h-7 w-7 flex-shrink-0 cursor-pointer"
                            checked={settings.hideEmptySetlists}
                            onChange={handleSettingChange(SettingsKeys.HideEmptySetlists)}
                            type="checkbox"
                        />
                        <span id="hide-empty-setlists-span">{i18n("settings:hideEmptySetlists")}</span>
                    </label>
                    <label id="filter-by-country" className="flex items-center space-x-2 p-2">
                        <select
                            id="country-select"
                            className={`w-1/2 max-w-52 cursor-pointer rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                resolvedTheme === "dark"
                                    ? "border-gray-600 bg-gray-700 text-gray-200"
                                    : "border-gray-400 bg-white text-gray-800"
                            }`}
                            onChange={handleSettingChange(SettingsKeys.CountryFilter)}
                            value={settings.countryFilter}
                        >
                            <option id="no-filter-option" value="">
                                {i18n("settings:noFilter")}
                            </option>
                            {Object.entries(countryCodes)
                                .map(([code, name]) => ({ code, name }))
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(({ code, name }) => (
                                    <option id={`country-option-${code}`} key={code} value={code}>
                                        {name}
                                    </option>
                                ))}
                        </select>
                        <span id="filter-by-country-span">{i18n("settings:filterByCountry")}</span>
                    </label>
                </div>
                {/* Export Settings */}
                <div id="export-settings" className="mb-4">
                    <h3 id="export-title" className="text-lg font-medium">
                        {i18n("common:export")}
                    </h3>
                    <label id="hide-songs-not-found" className="flex items-center space-x-2 p-2">
                        <input
                            id="hide-songs-not-found-checkbox"
                            className="h-7 w-7 flex-shrink-0 cursor-pointer"
                            checked={settings.hideSongsNotFound}
                            onChange={handleSettingChange(SettingsKeys.HideSongsNotFound)}
                            type="checkbox"
                        />
                        <span id="hide-songs-not-found-span">{i18n("settings:hideSongsNotFound")}</span>
                    </label>
                    <label id="exclude-covers" className="flex items-center space-x-2 p-2">
                        <input
                            id="exclude-covers-checkbox"
                            className="h-7 w-7 flex-shrink-0 cursor-pointer"
                            checked={settings.excludeCovers}
                            onChange={handleSettingChange(SettingsKeys.ExcludeCovers)}
                            type="checkbox"
                        />
                        <span id="exclude-covers-span">{i18n("settings:excludeCovers")}</span>
                    </label>
                    <label id="exclude-duplicate-songs" className="flex items-center space-x-2 p-2">
                        <input
                            id="exclude-duplicate-songs-checkbox"
                            className="h-7 w-7 flex-shrink-0 cursor-pointer"
                            checked={settings.excludeDuplicateSongs}
                            onChange={handleSettingChange(SettingsKeys.ExcludeDuplicateSongs)}
                            type="checkbox"
                        />
                        <span id="exclude-duplicate-songs-span">{i18n("settings:excludeDuplicateSongs")}</span>
                    </label>
                    <label id="exclude-played-on-tape" className="flex items-center space-x-2 p-2">
                        <input
                            id="exclude-played-on-tape-checkbox"
                            className="h-7 w-7 flex-shrink-0 cursor-pointer"
                            checked={settings.excludePlayedOnTape}
                            onChange={handleSettingChange(SettingsKeys.ExcludePlayedOnTape)}
                            type="checkbox"
                        />
                        <span id="exclude-played-on-tape-span">{i18n("settings:excludePlayedOnTape")}</span>
                    </label>
                </div>
                {/* About + Support Link */}
                <div
                    id="about-support-link-container"
                    className="absolute bottom-16 left-1/2 flex w-3/4 -translate-x-1/2 transform justify-center text-lg"
                >
                    <Link
                        id="about-support-link"
                        className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                        href="/about"
                    >
                        {i18n("about:aboutSupport")}
                    </Link>
                </div>
                {/* Privacy Policy Link */}
                <div
                    id="privacy-policy-link-container"
                    className="absolute bottom-6 left-1/2 flex w-3/4 -translate-x-1/2 transform justify-center text-lg"
                >
                    <Link
                        id="privacy-policy-link"
                        className="cursor-pointer text-blue-500 hover:text-blue-700 hover:underline"
                        href="/privacy-policy"
                    >
                        {i18n("privacyPolicy:privacyPolicy")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Settings;
