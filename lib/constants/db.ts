/**
 * Setlist to Playlist. The MIT License (MIT).
 * Copyright (c) Henri Roberts (github.com/H-jj-R).
 * See LICENSE for details.
 */

import mysql from "mysql2/promise";

/**
 * Create a connection pool to the MySQL database.
 */
const db = mysql.createPool({
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    password: process.env.DB_PASSWORD!,
    user: process.env.DB_USER!
});

export default db;
