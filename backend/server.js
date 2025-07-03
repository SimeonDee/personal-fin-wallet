import express from "express"
import "dotenv/config"
import morgan from "morgan"
import { initDB, sql } from "./config/db.js"
import transactionRouter from "./routes/transactionRoutes.js"

const app = express()
// const morgan_logger = morgan(':method :url :status :res[content-length] - :response-time ms')
const morgan_logger = morgan('dev')
const PORT = process.env.PORT || 5000


// Middlewares
app.use(morgan_logger)

// Routers
app.use("/api/transactions", transactionRouter)

// Health check
app.get("/health", (req, res) => {
    res.send("Health check Okay!")
})

// Connect DB and listen for requests
initDB().then(() => {
    app.listen(PORT, () => console.log(`Server live on port ${PORT}...`))
}).catch((error) => {
    console.log("Error initializing db",error )
    process.exit(1)
})