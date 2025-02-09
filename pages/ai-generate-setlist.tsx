/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import ExportDialog from "@components/Dialogs/ExportDialog";
import SpotifyAuthDialog from "@components/Dialogs/SpotifyAuthDialog";
import AISetlist from "@components/SearchAndExport/AISetlist";
import SearchBar from "@components/SearchAndExport/SearchBar";
import ErrorMessage from "@components/Shared/ErrorMessage";
import Layout from "@components/Shared/Layout";
import PageState from "@constants/generateSetlistPageState";
import { useAuth } from "@context/AuthContext";
import generateSetlistHook from "@hooks/generateSetlistHook";
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Main page for viewing setlists.
 */
export default function AIGenerateSetlist() {
    const { handleCombineSetlists, handleExport, handleSearch, mounted, setState, state } = generateSetlistHook();
    const { isAuthenticated } = useAuth();
    const { t: i18n } = useTranslation();

    if (!mounted) return null;

    return (
        <Layout>
            {!isAuthenticated ? (
                // Dialog displayed when the user is not authenticated
                <div className="flex items-center justify-center">
                    <div className="relative top-2/3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center text-white shadow-lg">
                        <h2 className="mb-4 text-2xl font-bold">{i18n("common:authenticationRequired")}</h2>
                        <p className="mb-6 text-lg">{i18n("common:needToLogIn")}</p>
                    </div>
                </div>
            ) : (
                // Main content when the user is authenticated
                <>
                    {/* Search bar */}
                    <div id="search-bar-container" className="overflow-hidden p-5">
                        <div
                            id="search-bar"
                            className={`fixed left-1/2 -translate-x-1/2 transform transition-all duration-[750ms] ease-in-out ${
                                state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                            }`}
                        >
                            <SearchBar aria-label={i18n("generateSetlist:searchForArtist")} onSearch={handleSearch} />
                        </div>

                        {/* Loading indicator */}
                        {state.showLoading && !state.animLoading && (
                            <div id="progress-indicator" className="mt-16 flex flex-col items-center pt-8">
                                <p className="mb-2 text-lg font-medium text-gray-700">
                                    {state.progress < 100
                                        ? `Generating setlist... (${state.progress}%)`
                                        : "Finalising..."}
                                </p>
                                <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-300">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${state.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {state.pageState === PageState.Idle && (
                            <>
                                {/* Error indicator */}
                                {state.error && (
                                    <div id="error-message" className="mx-auto mt-5 max-w-4xl pt-8">
                                        <ErrorMessage message={state.error} />
                                    </div>
                                )}
                            </>
                        )}

                        {state.pageState === PageState.Setlist && (
                            <>
                                <div className="overflow-hidden pt-5">
                                    <div className="mt-6 flex justify-center">
                                        <button
                                            className="shadow-mdtransition rounded-lg bg-gradient-to-bl from-green-400 to-green-600 px-6 py-3 font-semibold text-white duration-300 hover:from-green-500 hover:to-green-700"
                                            onClick={handleCombineSetlists}
                                        >
                                            {i18n("generateSetlist:combineExportAll")}
                                        </button>
                                    </div>
                                </div>
                                <div id="setlist-container" className="mt-2 flex gap-4">
                                    {state.predictedSetlists.slice(0, 3).map((setlist, index) => (
                                        <div id="setlist-display" className="w-full animate-fadeIn" key={index}>
                                            <AISetlist
                                                onExport={handleExport}
                                                predictionNum={index + 1}
                                                setlist={[setlist]}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Spotify Authorisation Dialog */}
                    {state.showAuthDialog && (
                        <SpotifyAuthDialog
                            onClose={() => {
                                setState((prev) => ({
                                    ...prev,
                                    showAuthDialog: false
                                }));
                            }}
                        />
                    )}

                    {/* Export Dialog */}
                    {state.pageState === PageState.Setlist && (
                        <ExportDialog
                            artistData={{
                                setlistfmArtist: state.allSetlistsData.setlistfmArtist,
                                spotifyArtist: state.allSetlistsData.spotifyArtist
                            }}
                            isOpen={state.exportDialogOpen}
                            onClose={() => {
                                setState((prev) => ({
                                    ...prev,
                                    chosenSetlist: null,
                                    exportDialogOpen: false
                                }));
                            }}
                            predictedSetlist={true}
                            setlist={state.chosenSetlist}
                        />
                    )}
                </>
            )}
        </Layout>
    );
}
