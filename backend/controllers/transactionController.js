import {sql} from "../config/db.js"

export const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params
        const transactions = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `
        res.json(transactions)
    } catch (error) {
        console.log(`Error fetching transactions for user ${userId}`, error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getUserTransactionSummary = async (req, res) => {
    try {
        const { userId } = req.params
        
        // // A more efficient query is to use UNION
        // const summaryResults = await sql`
        //     SELECT SUM(amount) AS balance FROM transactions
        //     WHERE user_id = ${userId}
        //     UNION
        //     SELECT SUM(amount) AS expenses FROM transactions
        //     WHERE user_id = ${userId} AND amount < 0
        //     UNION
        //     SELECT SUM(amount) AS income FROM transactions
        //     WHERE user_id = ${userId} AND amount > 0
        // `
        // if (summaryResults.length === 0){
        //     res.json({ message: "No transaction(s) yet." })
        // }
        // const { balance, income, expenses } = summaryResults[0]
        // res.json({ balance, income, expenses })

        const balanceResult = await sql`
            SELECT SUM(amount) AS balance FROM transactions
            WHERE user_id = ${userId}
        `
        const expensesResult = await sql`
            SELECT SUM(amount) AS expenses FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `
        const incomeResult = await sql`
            SELECT SUM(amount) AS income FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        `
        if (balanceResult.length === 0){
            res.json({ message: "No transaction(s) yet." })
        }
        summary = {
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses,
        }
        res.json(summary)
    } catch (error) {
        console.log("Error fetching summary", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const createTransaction = async (req, res) => {
    try {
        const { userId, title, amount, category } = req.body

        if (!userId || !title || !amount || !category){
            return res.status(400).json({ message: "All fields are required." })
        }
        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES ('${userId}','${title}', ${amount}, '${category}')
            RETURNING *
        `
        res.status(201).json(transaction[0])
    } catch (error) {
        console.log("Error creating transaction", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params

        const transaction = await sql`
            DELETE FROM transactions
            WHERE id = ${id}
            RETURNING *
        `
        if (transaction.length === 0){
            console.log(`No transaction for the given ID ${id}`)
            res.status(404).json({ message: "Transaction not found."})
        }
        res.status(200).json(transaction[0])
    } catch (error) {
        console.log(`Error deleting transaction ${id}`, error)
        res.status(500).json({ message: "Internal server error" })
    }
}