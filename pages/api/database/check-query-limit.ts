/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const DAILY_QUERY_LIMIT = 5;

/**
 * API handler to check the current query limit for a user, and increase it by 1 if the limit hasn't been reached.
 *
 * @param {NextApiRequest} req - The incoming API request object.
 * @param {NextApiResponse} res - The outgoing API response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Ensure the request method is POST
    if (req.method !== "POST") return res.status(405).json({ error: "common:methodNotAllowed" });

    // Extract the token from the Authorization header and verify it exists
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "common:authorisationError" });

    try {
        // Verify and decode the JWT token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.userId;

        // Check if the user exists in the UserQueryLimits table
        const [rows]: [any[], any] = await db.execute("SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1", [
            userId
        ]);

        let userQueryLimit = rows[0]; // Extract the first row

        // If the user's query limit doesn't yet exist in the database, insert a new record
        if (!userQueryLimit) {
            await db.execute(
                "INSERT INTO UserQueryLimits (user_id, queries_today, last_query_date) VALUES (?, 0, CURRENT_DATE)",
                [userId]
            );

            // Fetch the newly inserted row
            const [newRows]: [any[], any] = await db.execute(
                "SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1",
                [userId]
            );

            userQueryLimit = newRows[0]; // Extract the new first row
        }

        const { last_query_date, queries_today } = userQueryLimit;

        // Reset queries_today if the last query date is before today
        if (new Date(last_query_date).toISOString().split("T")[0] < new Date().toISOString().split("T")[0]) {
            await db.execute(
                "UPDATE UserQueryLimits SET queries_today = 0, last_query_date = CURRENT_DATE WHERE user_id = ?",
                [userId]
            );
        } else {
            // Enforce the query limit
            if (queries_today >= DAILY_QUERY_LIMIT) {
                return res.status(429).json({ error: "generateSetlist:queryLimitReached" });
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
