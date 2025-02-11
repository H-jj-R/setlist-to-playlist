/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SetlistChoiceBlock from "@components/SearchAndExport/SetlistChoiceBlock";
import listOfSetlistsHook from "@hooks/listOfSetlistsHook";
import { useTranslation } from "react-i18next";

interface ListOfSetlistsProps {
    onSetlistChosen: (setlist: Record<string, any>) => void; // Callback function that handles when a user selects a setlist
    setlistData: Record<string, any>; // The setlist data containing Spotify artist details and associated setlists
}

/**
 * This component displays a list of setlists for a given Spotify artist.
 * It shows the artist's image, name, and a list of setlists, allowing the user to select one.
 */
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ onSetlistChosen, setlistData }): JSX.Element => {
    const { t: i18n } = useTranslation();
    const { hasMorePages, loadMoreSetlists, state } = listOfSetlistsHook({ ...setlistData });

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-9rem)] w-full overflow-y-auto rounded-lg border-4 border-gray-300"
        >
            <div id="setlist-header" className="flex w-full flex-col items-center p-4">
                <div id="artist-info" className="mb-5 flex items-center px-4">
                    <img
                        id="artist-img"
                        className="mr-4 h-16 w-16 rounded-full"
                        alt={setlistData.spotifyArtist.name}
                        src={setlistData.spotifyArtist.images[0].url}
                    />
                    <h2 id="setlist-title" className="text-3xl font-bold">
                        {i18n("setlistSearch:setlistListTitle", { artistName: setlistData.spotifyArtist.name })}
                    </h2>
                </div>
                <ul id="setlist-list" className="w-full space-y-3 px-4">
                    {state.setlists.map(
                        (setlist: Record<string, any>): JSX.Element => (
                            <SetlistChoiceBlock
                                hideEmpty={state.hideEmptySetlists}
                                key={setlist.id}
                                onClick={onSetlistChosen}
                                setlist={setlist}
                            />
                        )
                    )}
                </ul>
                {state.hiddenSetlistsCount > 0 && state.hideEmptySetlists === true && (
                    <p id="hidden-setlists-count" className="mt-4 text-gray-500">
                        {i18n(
                            state.hiddenSetlistsCount === 1
                                ? "setlistSearch:hiddenSetlistsMessage"
                                : "setlistSearch:hiddenSetlistsMessagePlural",
                            { count: state.hiddenSetlistsCount }
                        )}
                    </p>
                )}
                {hasMorePages && (
                    <button
                        id="load-more-btn"
                        className="mt-4 rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                        disabled={state.isLoading}
                        onClick={loadMoreSetlists}
                    >
                        {state.isLoading ? `${i18n("common:loading")}...` : i18n("setlistSearch:loadMore")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListOfSetlists;
