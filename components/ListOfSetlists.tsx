import React from "react";

interface ListOfSetlistsProps {
    setlistData: Record<string, any>;
}
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ setlistData }) => {
    if (setlistData.setlists.setlist.length === 0) {
        return <p>No setlists found for {setlistData.spotifyArtist.name}. Please try a different query.</p>;
    }

    console.log(setlistData);

    return (
        <div className="mt-5 border border-gray-300 rounded-lg h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="p-4 w-full max-w-4xl flex justify-center">
                <div className="flex items-center mb-3 px-4">
                    <img
                        src={setlistData.spotifyArtist.images[0].url}
                        alt={setlistData.spotifyArtist.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <h2 className="text-3xl font-bold">Setlists for {setlistData.spotifyArtist.name}</h2>
                </div>
                <ul className="space-y-3 px-4">{/* Setlists will be listed here */}</ul>
            </div>
        </div>
    );
};

export default ListOfSetlists;
