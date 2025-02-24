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
import useGenerateSetlistHook from "@hooks/useGenerateSetlistHook";
import { useTranslation } from "react-i18next";

/**
 * Main page for AI generating, then viewing predicted setlists.
 *
 * @returns {JSX.Element} The rendered `/ai-generate-setlist` page.
 */
export default function AIGenerateSetlist(): JSX.Element {
    const { isAuthenticated } = useAuth(); // Authentication context
    const { t: i18n } = useTranslation(); // Translation hook

    // Hook initialiser to manage AI generate setlist page actions and state
    const { handleCombineSetlists, handleExport, handleSearch, mounted, setState, state } = useGenerateSetlistHook();

    if (!mounted) return null; // Don't render until hook is mounted

    return (
        <Layout>
            {!isAuthenticated ? (
                <div id="unauthenticated-dialog" className="flex items-center justify-center">
                    <div
                        id="auth-required-message"
                        className="relative top-2/3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-center text-white shadow-lg"
                    >
                        <h2 id="auth-required-title" className="mb-4 text-2xl font-bold">
                            {i18n("common:authenticationRequired")}
                        </h2>
                        <p id="auth-required-description" className="mb-6 text-lg">
                            {i18n("common:needToLogIn")}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div id="search-bar-container" className="overflow-hidden p-5">
                        <div
                            id="search-bar"
                            className={`fixed left-1/2 -translate-x-1/2 transform transition-all duration-[750ms] ease-in-out ${
                                state.searchTriggered ? "top-12 translate-y-0" : "top-[40%] -translate-y-1/2"
                            }`}
                        >
                            <SearchBar
                                aria-label={i18n("generateSetlist:searchForArtist")}
                                isPredicted={true}
                                locked={state.searchBarLocked}
                                onSearch={handleSearch}
                            />
                        </div>
                        {state.showLoading && !state.animLoading && (
                            <div id="progress-indicator" className="mt-16 flex flex-col items-center pt-8">
                                <div className="mb-2 flex items-center gap-3">
                                    <svg
                                        className="h-5 w-5 animate-spin align-middle text-gray-500"
                                        viewBox="0 0 50 50"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            className="opacity-30"
                                            cx={25}
                                            cy={25}
                                            fill="none"
                                            r={20}
                                            stroke="currentColor"
                                            strokeWidth={10}
                                        />
                                        <circle
                                            className="opacity-90"
                                            cx={25}
                                            cy={25}
                                            fill="none"
                                            r={20}
                                            stroke="currentColor"
                                            strokeDasharray="31.415, 31.415"
                                            strokeDashoffset={0}
                                            strokeWidth={10}
                                        />
                                    </svg>
                                    <p id="progress-text" className="text-lg font-medium text-gray-500">
                                        {state.progress < 100
                                            ? `${i18n("generateSetlist:generatingSetlist")}... (${state.progress}%)`
                                            : `${i18n("generateSetlist:finalising")}...`}
                                    </p>
                                </div>
                                <div
                                    id="progress-bar-container"
                                    className="h-2 w-64 overflow-hidden rounded-full bg-gray-300"
                                >
                                    <div
                                        id="progress-bar"
                                        className="h-full bg-blue-600 transition-all duration-300"
                                        style={{ width: `${state.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        {state.pageState === PageState.Idle && state.error && (
                            <div id="error-message" className="mx-auto mt-5 max-w-4xl pt-8">
                                <ErrorMessage message={state.error} />
                            </div>
                        )}
                        {state.pageState === PageState.Setlist && (
                            <>
                                <div id="setlist-actions-container" className="overflow-hidden pt-5">
                                    <div id="combine-export-btn-container" className="mt-6 flex justify-center">
                                        <button
                                            id="combine-export-btn"
                                            className="shadow-mdtransition rounded-lg bg-gradient-to-bl from-green-400 to-green-600 px-6 py-3 font-semibold text-white duration-300 hover:from-green-500 hover:to-green-700"
                                            onClick={handleCombineSetlists}
                                        >
                                            {i18n("generateSetlist:combineExportAll")}
                                        </button>
                                    </div>
                                </div>
                                <div id="setlist-container" className="mt-2 flex gap-4">
                                    {state.predictedSetlists.slice(0, 3).map(
                                        (setlist: Record<string, any>, idx: number): JSX.Element => (
                                            <div
                                                id={`setlist-display-${idx}`}
                                                className="w-full animate-fadeIn"
                                                key={idx}
                                            >
                                                <AISetlist
                                                    onExport={handleExport}
                                                    predictionNum={idx + 1}
                                                    setlist={[setlist]}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {state.showAuthDialog && (
                        <SpotifyAuthDialog
                            onClose={(): void => {
                                setState((prev) => ({
                                    ...prev,
                                    showAuthDialog: false
                                }));
                            }}
                        />
                    )}
                    {state.pageState === PageState.Setlist && (
                        <ExportDialog
                            artistData={{
                                setlistfmArtist: state.allSetlistsData.setlistfmArtist,
                                spotifyArtist: state.allSetlistsData.spotifyArtist
                            }}
                            isOpen={state.exportDialogOpen}
                            onClose={(): void => {
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
