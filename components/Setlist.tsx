import React from "react";

interface SetlistProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClose: () => void; // Function to handle the close action (navigate back to the list)
}

/**
 * Displays details of a specific setlist.
 */
const Setlist: React.FC<SetlistProps> = ({ setlist, onClose }) => {
    // Formats the event date string into a readable format (e.g., "01 Jan 1970")
    const formatDate = (dateString: string) => {
        // Splitting the date string and reordering for correct formatting
        const date = new Date(dateString.split("-").reverse().join("-"));
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // Construct the location string with venue name, city, and country details
    const locationDetails = `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}`;

    return (
        <div className="p-5 border border-gray-300 rounded-lg shadow-md h-[calc(100vh-10rem)] overflow-y-auto">
            <button className="mb-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={onClose}>
                Back to List
            </button>
            <h2 className="text-2xl font-bold mb-4">
                {setlist.artist.name} at {locationDetails}
            </h2>
            <p className="text-lg font-semibold mb-4">Date: {formatDate(setlist.eventDate)}</p>

            <ul className="list-disc ml-5">
                {setlist.sets.set.flatMap(
                    (set: any) => set.song.map((song: any, idx: number) => <li key={idx}>{song.name}</li>) // Map songs to list items
                )}
            </ul>
        </div>
    );
};

export default Setlist;
