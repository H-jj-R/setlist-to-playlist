/**
 * Formats location data into a human-readable string.
 *
 * @param {Record<string, any>} setlist - The setlist, which will contain the location info.
 * @returns {string} - The formatted location.
 */
export default function formatLocation(setlist: Record<string, any>) {
    return `${setlist.venue.name}, ${setlist.venue.city.name}${
        setlist.venue.city.country.code === "US" ? `, ${setlist.venue.city.stateCode}` : ""
    }, ${setlist.venue.city.country.name}` as string;
}
