import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Card } from "../config/typeconfig";
import { fundingAccountByCard, transferFunds, withdrawFunds } from "./query functions/transactionQF";

// Function to fund account by card (simulated)
export const fundAccountByCard = asyncHandler(async (req: Request, res: Response) => {
    const { card, accountNumber, amount }: { card: Card, accountNumber: number, amount: number } = req.body;

    // Basic validation for request data
    if (!card || !card.cardNumber || !card.cardHolderName || !card.expiryDate || !card.cvv || !accountNumber || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: "Invalid request data" });
        return;
    }

    try {
        // Simulate funding account by card and save transaction
        const savedTransaction = await fundingAccountByCard(card, accountNumber, amount);

        res.status(200).json({ message: "Account funded successfully", transaction: savedTransaction });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ error: "Failed to fund account. Please try again later." });
    }
});

// Function to send funds to another user's account
export const sendingFundsToUsers = asyncHandler(async (req: Request, res: Response) => {
    const { senderAccountNumber, receiverAccountNumber, amount }: { senderAccountNumber: number, receiverAccountNumber: number, amount: number } = req.body;

    // Basic validation for request data
    if (!senderAccountNumber || !receiverAccountNumber || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: "Invalid request data" });
        return;
    }

    try {
        // Transfer funds between accounts and save transaction
        const savedTransaction = await transferFunds(senderAccountNumber, receiverAccountNumber, amount);

        res.status(200).json({ message: "Transfer complete", transaction: savedTransaction });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ error: "Failed to send. Please try again later." });
    }
});

// Function to withdraw funds from an account
export const withdrawalOfFunds = asyncHandler(async (req: Request, res: Response) => {
    const { senderAccountNumber, externalDetails, amount }: { senderAccountNumber: number, externalDetails: string, amount: number } = req.body;

    // Basic validation for request data
    if (!senderAccountNumber || !externalDetails || isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: "Invalid request data" });
        return;
    }

    try {
        // Withdraw funds from account and save transaction
        const savedTransaction = await withdrawFunds(senderAccountNumber, externalDetails, amount);

        res.status(200).json({ message: "Withdrawal complete", transaction: savedTransaction });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({ error: "Withdrawal failed. Please try again later." });
    }
});
