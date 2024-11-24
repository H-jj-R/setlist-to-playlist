import React from "react";
import { useTranslation } from "react-i18next";
import SetlistChoiceBlock from "./SetlistChoiceBlock";

interface ListOfSetlistsProps {
    setlistData: Record<string, any>; // The setlist data containing Spotify artist details and associated setlists
    onSetlistChosen: (setlist: Record<string, any>) => void; // Callback function that handles when a user selects a setlist
}

/**
 * This component displays a list of setlists for a given Spotify artist.
 * It shows the artist's image, name, and a list of setlists, allowing the user to select one.
 */
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ setlistData, onSetlistChosen }) => {
    const { t: i18n } = useTranslation("setlist-search");

    return (
        <div className="h-[calc(100vh-10rem)] overflow-y-auto border border-gray-300 rounded-lg w-full">
            <div className="p-4 w-full flex flex-col items-center">
                <div className="flex items-center mb-5 px-4">
                    <img
                        src={setlistData.spotifyArtist.images[0].url}
                        alt={setlistData.spotifyArtist.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <h2 className="text-3xl font-bold">
                        {i18n("setlistListTitle", { artistName: setlistData.spotifyArtist.name })}
                    </h2>
                </div>
                <ul className="space-y-3 px-4 w-full">
                    {setlistData.setlists.setlist.map((setlist: Record<string, any>) => (
                        <SetlistChoiceBlock key={setlist.id} setlist={setlist} onClick={onSetlistChosen} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListOfSetlists;
