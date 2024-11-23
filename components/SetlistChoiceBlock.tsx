import React from "react";

interface SetlistChoiceBlockProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClick: (setlist: Record<string, any>) => void; // The function to be triggered when the setlist block is clicked
}

/**
 * Displays information about a setlist, including event date, artist, location, and song count.
 */
const SetlistBlock: React.FC<SetlistChoiceBlockProps> = ({ setlist, onClick }) => {
    // Formats the event date string into a readable format (e.g. "01 Jan 1970")
    const formatDate = (dateString: string) => {
        // Splitting the date string and reordering for correct formatting
        const date = new Date(dateString.split("-").reverse().join("-"));
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Calculate the total number of songs in the setlist
    const songCount = setlist.sets.set.reduce(
        (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
        0
    );

    // Construct the location string with venue name, city, and country details
    const locationDetails = `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}`;

    return (
        <li
            className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick(setlist)}
        >
            <div className="text-lg font-semibold">{formatDate(setlist.eventDate)}</div>
            <div className="text-lg">
                {setlist.artist.name} at {locationDetails}
            </div>
            <div className="text-base italic">
                {songCount} {songCount === 1 ? "song" : "songs"}
            </div>
        </li>
    );
};

export default SetlistBlock;
