/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

/**
 * Formats location data into a human-readable string.
 *
 * @param {Record<string, any>} setlist - The setlist, which will contain the location info.
 * @returns {string} - The formatted location.
 */
export default function formatLocation(setlist: Record<string, any>): string {
    return `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}` as string;
}
