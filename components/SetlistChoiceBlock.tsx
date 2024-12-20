import React from "react";
import { useTranslation } from "react-i18next";
import formatDate from "../lib/utils/formatDate";

interface SetlistChoiceBlockProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClick: (setlist: Record<string, any>) => void; // The function to be triggered when the setlist block is clicked
}

/**
 * Displays information about a setlist, including event date, artist, location, and song count.
 */
const SetlistChoiceBlock: React.FC<SetlistChoiceBlockProps> = ({ setlist, onClick }) => {
    const { t: i18n } = useTranslation("setlist-search");

    // Calculate the total number of songs in the setlist
    const songCount = setlist.sets.set.reduce(
        (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
        0
    );
    const isDisabled = songCount === 0;

    // Construct the location string with venue name, city, and country details
    const location = `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}`;

    return (
        <li
            id={`setlist-item-${setlist.id}`}
            className={`p-4 rounded-lg transition-shadow border border-gray-200 shadow-sm ${
                isDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md cursor-pointer"
            }`}
            onClick={() => !isDisabled && onClick(setlist)}
        >
            <div id={`setlist-date-${setlist.id}`} className={`text-lg font-semibold ${isDisabled ? "text-sm" : ""}`}>
                {formatDate(setlist.eventDate)}
            </div>
            <div id={`setlist-venue-${setlist.id}`} className={`text-lg ${isDisabled ? "text-sm" : ""}`}>
                {i18n("artistAtVenue", { artistName: setlist.artist.name, location })}
            </div>
            {!isDisabled && (
                <div id={`setlist-song-count-${setlist.id}`} className="text-base italic">
                    {songCount === 1 ? i18n("songCount", { songCount }) : i18n("songCount_plural", { songCount })}
                </div>
            )}
        </li>
    );
};

export default SetlistChoiceBlock;
