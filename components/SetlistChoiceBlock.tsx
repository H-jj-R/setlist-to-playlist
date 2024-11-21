import React from "react";

interface SetlistChoiceBlockProps {
    setlist: Record<string, any>;
    onClick: (setlist: Record<string, any>) => void;
}

const SetlistBlock: React.FC<SetlistChoiceBlockProps> = ({ setlist, onClick }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString.split("-").reverse().join("-"));
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const songCount = setlist.sets.set.reduce(
        (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
        0
    );

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
            <div className="text-base italic">{songCount} songs</div>
        </li>
    );
};

export default SetlistBlock;
