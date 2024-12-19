import React from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Setlist from "../components/Setlist";
import ExportDialog from "../components/ExportDialog";
import CustomHashLoader from "../components/CustomHashLoader";
import ErrorMessage from "../components/ErrorMessage";
import generateSetlistHook from "../lib/hooks/generateSetlistHook";
import { PageState } from "../lib/constants/generateSetlistPageState";

/**
 * Main page for viewing setlists.
 */
export default function SetlistSearch() {
    const { mounted, state, handleAuthoriseSpotify, handleSearch, handleExport, handleExportDialogClosed } =
        generateSetlistHook();

    if (!mounted) return null;

    return (
        <>
            <Layout>
                {/* Search bar */}
                <div className="p-5 overflow-hidden">
                    <div
                        className={`fixed left-1/2 transform -translate-x-1/2 transition-all duration-[750ms] ease-in-out ${
                            state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                        }`}
                    >
                        <SearchBar
                            onSearch={handleSearch}
                            locked={state.searchBarLocked}
                            aria-label="Search for setlists"
                        />

                        {/* Authorisation dialog */}
                        {state.showAuthDialog && (
                            <div className="mt-4 p-4  bg-green-500 border border-black rounded text-center">
                                <p className="mb-6 text-black text-xl">
                                    You need to authorise with Spotify to continue!
                                </p>
                                <button
                                    onClick={handleAuthoriseSpotify}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Authorise with Spotify
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Loading indicator */}
                    {state.showLoading && !state.animLoading && (
                        <div className="pt-8 mt-16 flex justify-center items-center">
                            <CustomHashLoader showLoading={state.showLoading} size={150} />
                        </div>
                    )}

                    {state.pageState === PageState.Idle && (
                        <>
                            {/* Error indicator */}
                            {state.error && (
                                <div className="pt-8 mt-5 max-w-4xl mx-auto">
                                    <ErrorMessage message={state.error} />
                                </div>
                            )}
                        </>
                    )}

                    {state.pageState === PageState.Setlist && (
                        <>
                            <div className="flex gap-4 mt-[3rem]">
                                {/* Setlist display */}
                                {state.pageState === PageState.Setlist && (
                                    <div className="w-full animate-fadeIn">
                                        <Setlist setlist={[]} onClose={() => {}} onExport={handleExport} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Layout>

            {/* Export Dialog */}
            {/* {(
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
            )} */}
        </>
    );
}
