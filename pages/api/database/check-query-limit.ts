import { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from "jwt-decode";
import db from "@constants/db";

const DAILY_QUERY_LIMIT = 5;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "errors:authorisationError" });
    }
    const userToken = authHeader.split(" ")[1];

    try {
        const userId = (jwtDecode(userToken) as any).userId;

        // Check if the user exists in the UserQueryLimits table
        const [rows]: [any[], any] = await db.execute("SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1", [
            userId
        ]);

        let userQueryLimit = rows[0]; // Extract the first row

        if (!userQueryLimit) {
            // If the user does not exist in the table, insert a new record
            await db.execute(
                "INSERT INTO UserQueryLimits (user_id, queries_today, last_query_date) VALUES (?, 0, CURRENT_DATE)",
                [userId]
            );

            // Fetch the newly inserted row
            const [newRows]: [any[], any] = await db.execute(
                "SELECT * FROM UserQueryLimits WHERE user_id = ? LIMIT 1",
                [userId]
            );

            userQueryLimit = newRows[0];
        }

        const { queries_today, last_query_date } = userQueryLimit;

        // Reset queries_today if the last query date is before today
        const today = new Date().toISOString().split("T")[0];
        const lastQueryDate = new Date(last_query_date).toISOString().split("T")[0];
        if (lastQueryDate < today) {
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

        // Increment the query count for the user
        await db.execute("UPDATE UserQueryLimits SET queries_today = queries_today + 1 WHERE user_id = ?", [userId]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "errors:internalServerError"
        });
    }
}
