import React, { useState } from "react";
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
    const { t: i18nCommon } = useTranslation("common");
    const { t: i18n } = useTranslation("setlist-search");
    const [setlists, setSetlists] = useState(setlistData.setlists.setlist || []);
    const [currentPage, setCurrentPage] = useState(setlistData.setlists.page || 1);
    const [isLoading, setIsLoading] = useState(false);

    const hasMorePages = currentPage < Math.ceil(setlistData.setlists.total / setlistData.setlists.itemsPerPage);
    const loadMoreSetlists = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/setlist-fm/search-setlists?${new URLSearchParams({
                    artistMbid: setlistData.setlistfmArtist.mbid,
                    page: currentPage + 1
                }).toString()}`
            );
            if (!response.ok) throw new Error("Failed to load more setlists");

            const newData = await response.json();
            setSetlists((prevSetlists) => [...prevSetlists, ...newData.setlist]);
            setCurrentPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Error loading more setlists:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-9rem)] overflow-y-auto border border-gray-300 rounded-lg w-full"
        >
            <div id="setlist-header" className="p-4 w-full flex flex-col items-center">
                <div id="artist-info" className="flex items-center mb-5 px-4">
                    <img
                        src={setlistData.spotifyArtist.images[0].url}
                        alt={setlistData.spotifyArtist.name}
                        className="w-16 h-16 rounded-full mr-4"
                        id="artist-image"
                    />
                    <h2 id="setlist-title" className="text-3xl font-bold">
                        {i18n("setlistListTitle", { artistName: setlistData.spotifyArtist.name })}
                    </h2>
                </div>
                <ul id="setlist-list" className="space-y-3 px-4 w-full">
                    {setlists.map((setlist: Record<string, any>) => (
                        <SetlistChoiceBlock key={setlist.id} setlist={setlist} onClick={onSetlistChosen} />
                    ))}
                </ul>
                {hasMorePages && (
                    <button
                        id="load-more-button"
                        onClick={loadMoreSetlists}
                        disabled={isLoading}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {isLoading ? `${i18nCommon("loading")}...` : i18n("loadMore")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListOfSetlists;
