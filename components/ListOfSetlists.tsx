import React from "react";
import SetlistChoiceBlock from "./SetlistChoiceBlock";

interface ListOfSetlistsProps {
    setlistData: Record<string, any>;
    onSetlistChosen: (setlist: Record<string, any>) => void;
}

const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ setlistData, onSetlistChosen }) => {
    if (!setlistData.setlists?.setlist || setlistData.setlists.setlist.length === 0) {
        return <p>No setlists found for {setlistData.spotifyArtist.name}. Please try a different query.</p>;
    }

    return (
        <div className="border border-gray-300 rounded-lg h-[calc(100vh-10rem)] overflow-y-auto">
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
                        <SetlistChoiceBlock
                            key={setlist.id}
                            setlist={setlist}
                            onClick={onSetlistChosen}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListOfSetlists;
