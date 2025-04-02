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
import Image from "next/image";
import { useTranslation } from "react-i18next";

/**
 * Props for the `ListOfSetlists` component.
 *
 * @property {Function} handleCombineSetlists - Callback function which is triggered when user presses 'Combine + Export All' button.
 * @property {Function} onSetlistChosen - Callback function that is triggered when user selects a setlist.
 * @property {string} selectedSetlistId - ID of a selected setlist, if there is one.
 * @property {Record<string, any>} setlistData - The setlist data containing details about the artist and their setlists.
 * @property {null | string} [userId] - The ID of the user, if searching by user ID.
 */
interface ListOfSetlistsProps {
    handleCombineSetlists: (setlist: Record<string, any>) => void;
    onSetlistChosen: (setlist: Record<string, any>) => void;
    selectedSetlistId: string;
    setlistData: Record<string, any>;
    userId?: null | string;
}

/**
 * **ListOfSetlists Component**
 *
 * Displays a list of setlists for a given Spotify artist.
 *
 * @param ListOfSetlistsProps - The component props.
 *
 * @returns The rendered `ListOfSetlists` component.
 */
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({
    handleCombineSetlists,
    onSetlistChosen,
    selectedSetlistId,
    setlistData,
    userId
}) => {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage setlist state and pagination
    const { hasMorePages, loadMoreSetlists, state } = useListOfSetlistsHook({ ...setlistData }, userId);

    // Retrieve user's selected country filter from local storage
    const countryFilter = localStorage?.getItem(SettingsKeys.CountryFilter) ?? "";

    return (
        <div
            id="list-of-setlists-container"
            className="animate-fade-in h-[calc(100vh-9rem)] w-full overflow-y-auto rounded-lg border-4 border-gray-300"
        >
            <div id="list-of-setlists-header" className="flex w-full flex-col items-center p-4">
                {setlistData.spotifyArtist ? (
                    <>
                        <div id="artist-info" className="flex items-center px-4">
                            <Image
                                id="artist-img"
                                className="mr-4 h-16 w-16 rounded-full"
                                alt={`${setlistData.spotifyArtist.name} ${i18n("common:image")}`}
                                height={700}
                                src={setlistData.spotifyArtist.images[0]?.url || "/images/artist-placeholder.jpg"}
                                width={700}
                            />
                            <h2 id="list-of-setlists-title" className="text-3xl font-bold">
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
                        {state.setlists.length > 0 && (
                            <div id="combine-export-btn-container" className="mb-1 flex justify-center p-2">
                                <button
                                    id="combine-export-btn"
                                    className="rounded-lg bg-linear-to-bl from-green-400 to-green-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:cursor-pointer hover:from-green-500 hover:to-green-700"
                                    onClick={(): void => handleCombineSetlists(state.setlists)}
                                    role="button"
                                >
                                    {i18n("setlistSearch:combineExportAllSetlists")}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div id="user-info" className="flex items-center px-4 pb-6">
                        <h2 id="list-of-setlists-title" className="text-3xl font-bold">
                            {`${i18n("setlistSearch:userAttendedTitle", { userId: userId })}`}
                        </h2>
                    </div>
                )}
                {state.setlists.length > 0 ? (
                    <>
                        <ul id="setlist-list" className="w-full space-y-3 px-4">
                            {state.setlists.map((setlist: Record<string, any>) => (
                                <SetlistChoiceBlock
                                    hideEmpty={state.hideEmptySetlists}
                                    key={setlist.id}
                                    onClick={onSetlistChosen}
                                    selected={setlist.id === selectedSetlistId}
                                    setlist={setlist}
                                />
                            ))}
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
                                className="mt-4 rounded-sm bg-blue-500 px-6 py-2 text-white transition hover:cursor-pointer hover:bg-blue-600"
                                disabled={state.isLoading}
                                onClick={loadMoreSetlists}
                                role="button"
                            >
                                {state.isLoading ? `${i18n("common:loading")}...` : i18n("setlistSearch:loadMore")}
                            </button>
                        )}
                    </>
                ) : (
                    <div id="error-message-container" className="mt-4 w-4/5">
                        <ErrorMessage message={i18n("setlistSearch:setlistFmNoSetlistsError")} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOfSetlists;
