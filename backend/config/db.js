import {neon} from "@neondatabase/serverless"
import "dotenv/config"

export const sql = neon(process.env.DB_CONN_URI)

export const initDB = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE,
        )`

        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initializing DB", error)
        process.exit(1)  //failure
    }
}