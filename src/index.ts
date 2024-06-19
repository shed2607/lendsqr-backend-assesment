import express, { Express, Request, Response } from "express";
import cors from "cors";
import { knexdb } from "./config/dbconfig";
import authRoutes from "./routes/authRoutes"
import transactionRoutes from "./routes/transactionRoutes";
import asyncHandler from "express-async-handler";

const app: Express = express();
const port: number = 3000;
app.use(cors());
app.use(express.json());

// Endpoint to fetch all users
app.get("/", asyncHandler(async (req: Request, res: Response) => {
    try {
        // Fetch all users from the 'User' table using knex
        const users = await knexdb.select().from('User');
        res.status(200).json(users); // Respond with JSON array of users
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" }); // Handle server error
    }
}));

app.use("/auth", authRoutes); // Mount authentication routes
app.use("/transaction", transactionRoutes); // Mount transaction routes

app.listen(port, () => {
    console.log("Server running on port " + port); // Log server start
});
