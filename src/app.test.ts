import request from "supertest";
import express, { Express } from "express";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();

// Mock middleware and JSON parsing
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

describe("Authentication Routes", () => {
    it("POST /auth/createUser should create a new user", async () => {
        const response = await request(app)
            .post("/auth/createUser")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                password: "password123",
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        // Add more assertions based on your expected response
    });

    it("POST /auth/loginUser should log in a user", async () => {
        const response = await request(app)
            .post("/auth/loginUser")
            .send({
                accountNumber: 1234567890,
                password: "password123",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        // Add more assertions based on your expected response
    });
});

describe("Transaction Routes", () => {
    it("POST /transaction/fundByCard should fund an account by card", async () => {
        const response = await request(app)
            .post("/transaction/fundByCard")
            .send({
                card: {
                    cardNumber: "1234567890123456",
                    cardHolderName: "John Doe",
                    expiryDate: "12/24",
                    cvv: "123",
                },
                accountNumber: 1234567890,
                amount: 100,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Account funded successfully");
        // Add more assertions based on your expected response
    });

    it("POST /transaction/sendingFunds should send funds to another user", async () => {
        const response = await request(app)
            .post("/transaction/sendingFunds")
            .send({
                senderAccountNumber: 1234567890,
                receiverAccountNumber: 9876543210,
                amount: 50,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Transfer complete");
        // Add more assertions based on your expected response
    });

    it("POST /transaction/withdrawalFunds should withdraw funds from an account", async () => {
        const response = await request(app)
            .post("/transaction/withdrawalFunds")
            .send({
                senderAccountNumber: 1234567890,
                externalDetails: "ATM withdrawal",
                amount: 20,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Transfer complete");
        // Add more assertions based on your expected response
    });
});
