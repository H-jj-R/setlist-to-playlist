/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

/**
 * Formats a date string (in "YYYY-MM-DD" format) into a human-readable UK date format.
 *
 * @param {string} dateString - The date string to format, expected in "YYYY-MM-DD" format.
 * @returns {string} - The formatted date in "DD MMM YYYY" format (e.g. "01 Jan 1970").
 */
export default function formatDate(dateString: string) {
    return new Date(dateString.split("-").reverse().join("-")).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
