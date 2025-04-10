/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import ExportDialog from "@components/Dialogs/ExportDialog";
import SpotifyAuthDialog from "@components/Dialogs/SpotifyAuthDialog";
import ListOfSetlists from "@components/SearchAndExport/ListOfSetlists";
import SearchBar from "@components/SearchAndExport/SearchBar";
import Setlist from "@components/SearchAndExport/Setlist";
import CustomHashLoader from "@components/Shared/CustomHashLoader";
import ErrorMessage from "@components/Shared/ErrorMessage";
import Layout from "@components/Shared/Layout";
import PageState from "@constants/setlistSearchPageState";
import useSetlistSearchHook from "@hooks/useSetlistSearchHook";
import { useTranslation } from "react-i18next";

/**
 * Main page for viewing setlists.
 *
 * @returns The rendered `/setlist-search` page.
 */
export default function SetlistSearch() {
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage setlist search page actions and state
    const {
        handleBackToList,
        handleCombineSetlists,
        handleExport,
        handleSearchRouterPush,
        handleSetlistChosenRouterPush,
        mounted,
        setState,
        state
    } = useSetlistSearchHook();

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <>
            <Layout>
                <div id="search-container" className="overflow-hidden p-5">
                    <div
                        id="search-bar"
                        className={`fixed left-1/2 -translate-x-1/2 transform transition-all duration-[750ms] ease-in-out ${
                            state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                        }`}
                    >
                        <SearchBar
                            aria-label={i18n("setlistSearch:searchForSetlist")}
                            onSearch={handleSearchRouterPush}
                        />
                    </div>
                    {state.showLoading && !state.animLoading && (
                        <div id="loading-indicator" className="mt-16 flex items-center justify-center pt-8">
                            <CustomHashLoader showLoading={state.showLoading} size={150} />
                        </div>
                    )}
                    {state.error && !state.animLoading && (
                        <div id="error-message" className="mx-auto mt-5 max-w-4xl pt-8">
                            <ErrorMessage message={state.error} />
                        </div>
                    )}
                    {state.pageState !== PageState.Idle && (
                        <div id="list-of-setlists-container" className="mt-[3rem] flex gap-4">
                            {state.searchComplete && !state.animLoading && (
                                <div
                                    id="list-of-setlists"
                                    className={`${
                                        state.setlistChosen
                                            ? "animate-fade-in mx-auto hidden w-4/5 max-w-3xl sm:block"
                                            : "animate-fade-in mx-auto block w-4/5 max-w-3xl"
                                    }`}
                                >
                                    <ListOfSetlists
                                        handleCombineSetlists={handleCombineSetlists}
                                        onSetlistChosen={handleSetlistChosenRouterPush}
                                        selectedSetlistId={state.chosenSetlistData?.id}
                                        setlistData={state.allSetlistsData}
                                        userId={state.userId}
                                    />
                                </div>
                            )}
                            {((state.setlistChosen && !state.animLoading && state.pageState === PageState.LosSetlist) ||
                                state.pageState === PageState.Setlist) && (
                                <div id="setlist-display" className={`animate-fade-in w-full`}>
                                    <Setlist
                                        isAlone={state.pageState === PageState.Setlist}
                                        onClose={handleBackToList}
                                        onExport={handleExport}
                                        setlist={state.chosenSetlistData}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Layout>
            {state.showAuthDialog && (
                <SpotifyAuthDialog
                    onClose={(): void => {
                        setState((prev) => ({ ...prev, showAuthDialog: false }));
                    }}
                />
            )}
            {((state.setlistChosen && !state.animLoading && state.pageState === PageState.LosSetlist) ||
                state.pageState === PageState.ListOfSetlists ||
                state.pageState === PageState.Setlist) &&
                state.exportDialogOpen && (
                    <ExportDialog
                        artistData={{
                            setlistfmArtist: state.allSetlistsData.setlistfmArtist,
                            spotifyArtist: state.allSetlistsData.spotifyArtist
                        }}
                        isOpen={state.exportDialogOpen}
                        onClose={(): void => {
                            setState((prev) => ({ ...prev, exportDialogOpen: false, mergedSetlistData: null }));
                        }}
                        setlist={state.mergedSetlistData || state.chosenSetlistData}
                    />
                )}
        </>
    );
}
