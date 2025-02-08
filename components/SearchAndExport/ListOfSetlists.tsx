/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SetlistChoiceBlock from "@components/SearchAndExport/SetlistChoiceBlock";
import { SettingsKeys } from "@constants/settingsKeys";

interface ListOfSetlistsProps {
    setlistData: Record<string, any>; // The setlist data containing Spotify artist details and associated setlists
    onSetlistChosen: (setlist: Record<string, any>) => void; // Callback function that handles when a user selects a setlist
}

/**
 * This component displays a list of setlists for a given Spotify artist.
 * It shows the artist's image, name, and a list of setlists, allowing the user to select one.
 */
const ListOfSetlists: React.FC<ListOfSetlistsProps> = ({ setlistData, onSetlistChosen }) => {
    const { t: i18n } = useTranslation();
    const [state, setState] = useState({
        loadedSetlists: (setlistData.setlists.setlist || []) as Record<string, any>[] | [],
        setlists: (setlistData.setlists.setlist || []) as Record<string, any>[] | [],
        currentPage: ((setlistData.setlists.page as number) || 1) as number,
        isLoading: false,
        hiddenSetlistsCount: 0,
        hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true"
    });

    const filterEmptySetlists = (data: Record<string, any>[]) => {
        return data.filter((setlist: Record<string, any>) => {
            const songCount = setlist.sets.set.reduce(
                (count: number, set: Record<string, any>) => count + (set.song?.length || 0),
                0
            );
            return songCount > 0;
        });
    };

    // Update setlists
    useEffect(() => {
        const filteredSetlists = state.hideEmptySetlists
            ? filterEmptySetlists(state.loadedSetlists)
            : state.loadedSetlists;
        setState((prev) => ({
            ...prev,
            setlists: filteredSetlists,
            hiddenSetlistsCount: state.loadedSetlists.length - filteredSetlists.length
        }));
    }, [state.hideEmptySetlists, state.loadedSetlists]);

    useEffect(() => {
        const handleStorageChange = () => {
            setState((prev) => ({
                ...prev,
                hideEmptySetlists: localStorage?.getItem(SettingsKeys.HideEmptySetlists) === "true"
            }));
        };

        window.addEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);
        return () => {
            window.removeEventListener(SettingsKeys.HideEmptySetlists, handleStorageChange);
        };
    }, []);

    const hasMorePages = state.currentPage < Math.ceil(setlistData.setlists.total / setlistData.setlists.itemsPerPage);
    
    const loadMoreSetlists = async () => {
        setState((prev) => ({
            ...prev,
            isLoading: true
        }));
        try {
            const response = await fetch(
                `/api/setlist-fm/search-setlists?${new URLSearchParams({
                    artistMbid: setlistData.setlistfmArtist.mbid,
                    page: (state.currentPage + 1).toString()
                }).toString()}`
            );
            const responseJson = await response.json();
            if (!response.ok) {
                throw {
                    status: response.status,
                    error: i18n(responseJson.error) || i18n("common:unexpectedError")
                };
            }

            const newData = responseJson;
            const newSetlists = newData.setlist || [];
            setState((prev) => ({
                ...prev,
                loadedSetlists: [...prev.loadedSetlists, ...newSetlists] as Record<string, any>[],
                currentPage: prev.currentPage + 1
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setState((prev) => ({
                ...prev,
                isLoading: false
            }));
        }
    };

    return (
        <div
            id="setlist-container"
            className="h-[calc(100vh-9rem)] overflow-y-auto border-4 border-gray-300 rounded-lg w-full"
        >
            <div id="setlist-header" className="p-4 w-full flex flex-col items-center">
                <div id="artist-info" className="flex items-center mb-5 px-4">
                    <img
                        id="artist-image"
                        className="w-16 h-16 rounded-full mr-4"
                        src={setlistData.spotifyArtist.images[0].url}
                        alt={setlistData.spotifyArtist.name}
                    />
                    <h2 id="setlist-title" className="text-3xl font-bold">
                        {i18n("setlistSearch:setlistListTitle", { artistName: setlistData.spotifyArtist.name })}
                    </h2>
                </div>
                <ul id="setlist-list" className="space-y-3 px-4 w-full">
                    {state.setlists.map((setlist: Record<string, any>) => (
                        <SetlistChoiceBlock
                            key={setlist.id}
                            setlist={setlist}
                            onClick={onSetlistChosen}
                            hideEmpty={state.hideEmptySetlists}
                        />
                    ))}
                </ul>
                {state.hiddenSetlistsCount > 0 && state.hideEmptySetlists === true && (
                    <p className="mt-4 text-gray-500">
                        {state.hiddenSetlistsCount === 1
                            ? i18n("setlistSearch:hiddenSetlistsMessage", { count: state.hiddenSetlistsCount })
                            : i18n("setlistSearch:hiddenSetlistsMessagePlural", { count: state.hiddenSetlistsCount })}
                    </p>
                )}
                {hasMorePages && (
                    <button
                        id="load-more-button"
                        onClick={loadMoreSetlists}
                        disabled={state.isLoading}
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {state.isLoading ? `${i18n("common:loading")}...` : i18n("setlistSearch:loadMore")}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListOfSetlists;
