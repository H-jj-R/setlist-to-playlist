import React from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Setlist from "../components/Setlist";
import ExportDialog from "../components/ExportDialog";
import CustomHashLoader from "../components/CustomHashLoader";
import ErrorMessage from "../components/ErrorMessage";
import generateSetlistHook from "../lib/hooks/generateSetlistHook";
import { PageState } from "../lib/constants/setlistSearchPageState";

/**
 * Main page for viewing setlists.
 */
export default function SetlistSearch() {
    const { mounted, state, handleSearch, handleExport, handleExportDialogClosed } = generateSetlistHook();

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
                        <SearchBar onSearch={handleSearch} locked={true} aria-label="Search for setlists" />
                    </div>

                    {/* Loading indicator */}
                    {state.showLoading && !state.animLoading && (
                        <div className="pt-8 mt-16 flex justify-center items-center">
                            <CustomHashLoader showLoading={state.showLoading} size={150} />
                        </div>
                    )}

                    {state.pageState !== PageState.Idle && (
                        <>
                            {/* Error indicator */}
                            {state.error && (
                                <div className="pt-8 mt-5 max-w-4xl mx-auto">
                                    <ErrorMessage message={state.error} />
                                </div>
                            )}

                            <div className="flex gap-4 mt-[3rem]">
                                {/* Setlist display */}
                                {state.pageState === PageState.Setlist && (
                                    <div className="w-full animate-fadeIn">
                                        <Setlist
                                            setlist={[]}
                                            onClose={() => {}}
                                            onExport={handleExport}
                                        />
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
