/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import formatDate from "@utils/formatDate";
import formatLocation from "@utils/formatLocation";

interface SetlistChoiceBlockProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClick: (setlist: Record<string, any>) => void; // The function to be triggered when the setlist block is clicked
    hideEmpty: boolean; // Whether to hide empty setlists
}

/**
 * Displays information about a setlist, including event date, artist, location, and song count.
 */
const SetlistChoiceBlock: React.FC<SetlistChoiceBlockProps> = ({ setlist, onClick, hideEmpty }) => {
    const { t: i18n } = useTranslation();

    // Calculate the total number of songs in the setlist
    const songCount = setlist.sets.set.reduce(
        (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
        0
    );
    const isDisabled = songCount === 0;

    return (
        <li
            id={`setlist-item-${setlist.id}`}
            className={`p-4 rounded-lg transition-shadow border border-gray-200 shadow-sm ${
                isDisabled && hideEmpty
                    ? "hidden"
                    : isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md cursor-pointer"
            }`}
            onClick={() => !isDisabled && onClick(setlist)}
        >
            <div id={`setlist-date-${setlist.id}`} className={`text-lg font-semibold ${isDisabled ? "text-sm" : ""}`}>
                {formatDate(setlist.eventDate)}
            </div>
            <div id={`setlist-venue-${setlist.id}`} className={`text-lg ${isDisabled ? "text-sm" : ""}`}>
                {i18n("setlistSearch:artistAtVenue", {
                    artistName: setlist.artist.name,
                    location: formatLocation(setlist)
                })}
            </div>
            {!isDisabled && (
                <div id={`setlist-song-count-${setlist.id}`} className="text-base italic">
                    {songCount === 1
                        ? i18n("setlistSearch:songCount", { songCount })
                        : i18n("setlistSearch:songCountPlural", { songCount })}
                </div>
            )}
        </li>
    );
};

export default SetlistChoiceBlock;
