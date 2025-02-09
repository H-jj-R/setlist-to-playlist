/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import db from "@constants/db";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler to delete a user account.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ error: "common:methodNotAllowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "common:authorisationError" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const userId = decoded.userId;

        // Delete the user from the database
        await db.execute("DELETE FROM Users WHERE user_id = ?", [userId]);

        res.status(200).json({ message: "account:deleteSuccess" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "common:internalServerError" });
    }
}
