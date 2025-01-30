import React from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import ListOfSetlists from "../components/ListOfSetlists";
import Setlist from "../components/Setlist";
import ExportDialog from "../components/ExportDialog";
import CustomHashLoader from "../components/CustomHashLoader";
import ErrorMessage from "../components/ErrorMessage";
import setlistSearchHook from "../lib/hooks/setlistSearchHook";
import { PageState } from "../lib/constants/setlistSearchPageState";
import { useTranslation } from "react-i18next";

/**
 * Main page for viewing setlists.
 */
export default function SetlistSearch() {
    const { t: i18n } = useTranslation();
    const {
        mounted,
        state,
        handleSearchRouterPush,
        handleBackToList,
        handleSetlistChosenRouterPush,
        handleExport,
        handleExportDialogClosed
    } = setlistSearchHook();

    if (!mounted) return null;

    return (
        <>
            <Layout>
                {/* Search bar */}
                <div id="search-container" className="p-5 overflow-hidden">
                    <div
                        id="search-bar"
                        className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-[750ms] ease-in-out ${
                            state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                        }`}
                    >
                        <SearchBar
                            onSearch={handleSearchRouterPush}
                            aria-label={i18n("setlistSearch:searchForSetlist")}
                        />
                    </div>

                    {/* Loading indicator */}
                    {state.showLoading && !state.animLoading && (
                        <div id="loading-indicator" className="pt-8 mt-16 flex justify-center items-center">
                            <CustomHashLoader showLoading={state.showLoading} size={150} />
                        </div>
                    )}

                    {/* Error indicator */}
                    {state.error && (
                        <div id="error-message" className="pt-8 mt-5 max-w-4xl mx-auto">
                            <ErrorMessage message={state.error} />
                        </div>
                    )}

                    {state.pageState !== PageState.Idle && (
                        <div id="setlists-container" className="flex gap-4 mt-[3rem]">
                            {/* List of setlists */}
                            {state.searchComplete && !state.animLoading && (
                                <div
                                    id="setlist-list"
                                    className={`${
                                        state.setlistChosen
                                            ? "hidden sm:block w-4/5 max-w-3xl mx-auto animate-fadeIn"
                                            : "block w-4/5 max-w-3xl mx-auto animate-fadeIn"
                                    }`}
                                >
                                    <ListOfSetlists
                                        setlistData={state.allSetlistsData}
                                        onSetlistChosen={handleSetlistChosenRouterPush}
                                    />
                                </div>
                            )}

                            {/* Setlist display */}
                            {((state.setlistChosen && !state.animLoading && state.pageState === PageState.LosSetlist) ||
                                state.pageState === PageState.Setlist) && (
                                <div id="setlist-display" className={`w-full animate-fadeIn`}>
                                    <Setlist
                                        setlist={state.chosenSetlistData}
                                        onClose={handleBackToList}
                                        onExport={handleExport}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Layout>

            {/* Export Dialog */}
            {((state.setlistChosen && !state.animLoading && state.pageState === PageState.LosSetlist) ||
                state.pageState === PageState.Setlist) && (
                <ExportDialog
                    setlist={state.chosenSetlistData}
                    artistData={{
                        spotifyArtist: state.allSetlistsData.spotifyArtist,
                        setlistfmArtist: state.allSetlistsData.setlistfmArtist
                    }}
                    isOpen={state.exportDialogOpen}
                    onClose={handleExportDialogClosed}
                />
            )}
        </>
    );
}
