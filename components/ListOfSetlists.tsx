import React from "react";

interface ListOfSetlistsProps {
    setlistData: Record<string, any>;
}

const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ setlistData }) => {
    if (!setlistData.setlists?.setlist || setlistData.setlists.setlist.length === 0) {
        return <p>No setlists found for {setlistData.spotifyArtist.name}. Please try a different query.</p>;
    }

    const handleSetlistClick = (setlist: Record<string, any>) => {
        console.log("Selected Setlist Details:", setlist);
        // Add navigation or detailed rendering logic here
    };

    return (
        <div className="mt-5 border border-gray-300 rounded-lg h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="p-4 w-full flex flex-col items-center">
                <div className="flex items-center mb-5 px-4">
                    <img
                        src={setlistData.spotifyArtist.images[0].url}
                        alt={setlistData.spotifyArtist.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <h2 className="text-3xl font-bold">Setlists for {setlistData.spotifyArtist.name}</h2>
                </div>
                <ul className="space-y-3 px-4 w-full">
                    {setlistData.setlists.setlist.map((setlist: Record<string, any>) => (
                        <li
                            key={setlist.id}
                            className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleSetlistClick(setlist)}
                        >
                            <div className="text-lg font-semibold">{setlist.eventDate}</div>
                            <div className="text-sm text-gray-600">
                                {setlist.venue.name}, {setlist.venue.city.name}, {setlist.venue.city.country.name}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListOfSetlists;
