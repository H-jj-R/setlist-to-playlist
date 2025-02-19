/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import formatDate from "@utils/formatDate";
import formatLocation from "@utils/formatLocation";
import { useTranslation } from "react-i18next";

/**
 * Props for the `SetlistChoiceBlock` component.
 *
 * @property {boolean} hideEmpty - Determines whether to hide empty setlists (setlists with no songs).
 * @property {Function} onClick - Callback function triggered when a user clicks on the setlist block.
 * @property {Record<string, any>} setlist - The setlist data containing event details.
 */
interface SetlistChoiceBlockProps {
    hideEmpty: boolean;
    onClick: (setlist: Record<string, any>) => void;
    setlist: Record<string, any>;
}

/**
 * **SetlistChoiceBlock Component**
 *
 * Displays information about a setlist, including event date, artist, location, and song count.
 *
 * @param SetlistChoiceBlockProps - The component props.
 *
 * @returns {JSX.Element} The rendered `SetlistChoiceBlock` component.
 */
const SetlistChoiceBlock: React.FC<SetlistChoiceBlockProps> = ({ hideEmpty, onClick, setlist }): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Calculate the total number of songs in the setlist
    const songCount: number = setlist.sets.set.reduce(
        (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
        0
    );

    // Disable component from being clicked if there are no songs
    const isDisabled: boolean = songCount === 0;

    return (
        <li
            id={`setlist-item-${setlist.id}`}
            className={`rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow ${
                isDisabled && hideEmpty
                    ? "hidden"
                    : isDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:shadow-md"
            }`}
            onClick={(): void => (!isDisabled ? onClick(setlist) : undefined)}
        >
            <div id="setlist-date" className={`text-lg font-semibold ${isDisabled ? "text-sm" : ""}`}>
                {formatDate(setlist.eventDate)}
            </div>
            <div id="setlist-venue" className={`text-lg ${isDisabled ? "text-sm" : ""}`}>
                {i18n("setlistSearch:artistAtVenue", {
                    artistName: setlist.artist.name,
                    location: formatLocation(setlist)
                })}
            </div>
            {!isDisabled && (
                <div id="setlist-song-count" className="text-base italic">
                    {i18n(songCount === 1 ? "setlistSearch:songCount" : "setlistSearch:songCountPlural", { songCount })}
                </div>
            )}
        </li>
    );
};

export default SetlistChoiceBlock;
