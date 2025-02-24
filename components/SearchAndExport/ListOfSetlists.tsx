/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import SetlistChoiceBlock from "@components/SearchAndExport/SetlistChoiceBlock";
import ErrorMessage from "@components/Shared/ErrorMessage";
import countryCodes from "@constants/countryCodes";
import SettingsKeys from "@constants/settingsKeys";
import useListOfSetlistsHook from "@hooks/useListOfSetlistsHook";
import { useTranslation } from "react-i18next";

/**
 * Props for the `ListOfSetlists` component.
 *
 * @property {Function} onSetlistChosen - Callback function that is triggered when a user selects a setlist.
 * @property {Record<string, any>} setlistData - The setlist data containing details about the artist and their setlists.
 */
interface ListOfSetlistsProps {
    handleCombineSetlists: (setlist: Record<string, any>) => void;
    onSetlistChosen: (setlist: Record<string, any>) => void;
    setlistData: Record<string, any>;
}

/**
 * **ListOfSetlists Component**
 *
 * Displays a list of setlists for a given Spotify artist.
 *
 * @param ListOfSetlistsProps - The component props.
 *
 * @returns {JSX.Element} The rendered `ListOfSetlists` component.
 */
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({
    handleCombineSetlists,
    onSetlistChosen,
    setlistData
}): JSX.Element => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage setlist state and pagination
    const { hasMorePages, loadMoreSetlists, state } = useListOfSetlistsHook({ ...setlistData });

    // Retrieve user's selected country filter from local storage
    const countryFilter = localStorage?.getItem(SettingsKeys.CountryFilter) ?? "";

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-9rem)] w-full overflow-y-auto rounded-lg border-4 border-gray-300"
        >
            <div id="setlist-header" className="flex w-full flex-col items-center p-4">
                <div id="artist-info" className="flex items-center px-4">
                    {setlistData.spotifyArtist.images[0]?.url && (
                        <img
                            id="artist-img"
                            className="mr-4 h-16 w-16 rounded-full"
                            alt={setlistData.spotifyArtist.name}
                            src={setlistData.spotifyArtist.images[0].url}
                        />
                    )}
                    <h2 id="setlist-title" className="text-3xl font-bold">
                        {`${i18n("setlistSearch:setlistListTitle", { artistName: setlistData.spotifyArtist.name })}${" "}
                        ${
                            countryFilter
                                ? `${i18n("setlistSearch:inCountry", {
                                      country: `${countryCodes[countryFilter]?.trim() || i18n("unknownCountry")}`
                                  })}`
                                : ""
                        }`}
                    </h2>
                </div>
                {state.setlists.length > 0 ? (
                    <>
                        <div id="combine-export-btn-container" className="mb-1 flex justify-center p-2">
                            <button
                                id="combine-export-btn"
                                className="shadow-mdtransition rounded-lg bg-gradient-to-bl from-green-400 to-green-600 px-6 py-3 font-semibold text-white duration-300 hover:from-green-500 hover:to-green-700"
                                onClick={(): void => handleCombineSetlists(state.setlists)}
                            >
                                {i18n("setlistSearch:combineExportAllSetlists")}
                            </button>
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
                    </>
                ) : (
                    <div id="error-message-container" className="w-4/5">
                        <ErrorMessage message={i18n("setlistSearch:setlistFmNoSetlistsError")} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOfSetlists;
