import mysql from "mysql2/promise";

/**
 *  Create a connection pool to the MySQL database
 */
const db = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export default db;
