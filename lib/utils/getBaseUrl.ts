import { NextApiRequest } from "next";

/**
 * Utility function to construct the base URL of the server.
 *
 * @param {NextApiRequest} req - The API request object.
 * @returns {string} - The base URL string.
 */
export default function getBaseUrl(req: NextApiRequest): string {
    const protocol = req.headers["x-forwarded-proto"] || "http"; // Determine the protocol (HTTP or HTTPS)
    const host = req.headers.host!; // Get the host from headers
    return `${protocol}://${host}`; // Construct and return the base URL
}
