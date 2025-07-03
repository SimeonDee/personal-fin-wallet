import express from "express"
import { 
    createTransaction,
    deleteTransaction,
    getUserTransactionSummary,
    getUserTransactions
 } from "../controllers/transactionController.js"

const router = express.Router()

router.post("/", createTransaction)
router.get("/:userId", getUserTransactions)
router.get("/summary/:userId", getUserTransactionSummary)
router.delete("/:userId", deleteTransaction)


export default router