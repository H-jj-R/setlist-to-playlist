import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecordVinyl } from "@fortawesome/free-solid-svg-icons";

interface SetlistProps {
    setlist: Record<string, any>; // The setlist data to be displayed
    onClose: () => void; // Function to handle the close action (navigate back to the list)
    onExport: () => void; // Function to trigger Spotify export (to be implemented)
}

const Setlist: React.FC<SetlistProps> = ({ setlist, onClose, onExport }) => {
    const { t: i18n } = useTranslation("setlist-search");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString.split("-").reverse().join("-"));
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const location: string = `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}`;

    const SongListItem = ({ song, isLast }: { song: any; isLast: boolean }) => (
        <li className={`py-2 ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {/* Tape indicator icon */}
                    {song.tape && (
                        <FontAwesomeIcon icon={faRecordVinyl} className="opacity-80" title="Played from tape" />
                    )}
                    {/* Song name */}
                    <span className={`font-medium ${song.tape ? "italic opacity-80" : ""}`}>
                        {song.name || (song.tape && !song.name ? "Intro" : "(Unknown)")}
                    </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right max-w-[60%]">
                    {/* Additional song details */}
                    {song.cover && `${song.cover.name} ${song.tape ? "song" : "cover"}${song.info ? "," : ""}`}
                    {song.info && ` ${song.info[0].toUpperCase() + song.info.slice(1)}`}
                    {song.with && ` (with ${song.with.name})`}
                </div>
            </div>
        </li>
    );

    return (
        <div className="px-5 border border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg h-[calc(100vh-9rem)] overflow-y-auto">
            {/* Container for buttons */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 w-full">
                <div className="flex justify-between items-center mb-6 pt-4 pb-2">
                    {/* Back Button */}
                    <button
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:ring focus:ring-red-300 w-full sm:w-auto"
                        onClick={onClose}
                    >
                        {i18n("backToList")}
                    </button>

                    {/* Export to Spotify Button */}
                    <button
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:ring focus:ring-green-300 w-full sm:w-auto"
                        onClick={onExport}
                    >
                        {i18n("exportToSpotify")}
                    </button>
                </div>
            </div>

            {/* Setlist Header */}
            <div className="mb-4">
                <h2 className="text-3xl font-bold">{setlist.artist.name}</h2>
                <p className="text-lg mt-1">{location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {i18n("setlistDate", { date: formatDate(setlist.eventDate) })}
                </p>
            </div>

            {/* Songs List */}
            {setlist.sets && setlist.sets.set.length > 0 ? (
                <ul className="space-y-1 pb-6">
                    {setlist.sets.set.flatMap((set: any, setIdx: number, setArray: any[]) =>
                        set.song.map((song: any, songIdx: number) => {
                            const isLast = setIdx === setArray.length - 1 && songIdx === set.song.length - 1;
                            return (
                                <SongListItem
                                    key={`${songIdx}-${song.name || "unknown"}`}
                                    song={song}
                                    isLast={isLast}
                                />
                            );
                        })
                    )}
                </ul>
            ) : (
                <p className="italic text-center">{i18n("noSongsFound")}</p>
            )}
        </div>
    );
};

export default Setlist;
