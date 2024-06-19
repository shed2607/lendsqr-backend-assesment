import express, { Express, Request, Response, Router } from "express";
import { fundAccountByCard, sendingFundsToUsers, withdrawalOfFunds } from ".././controller/transactionController";

const transaction: Router = Router();

transaction.post("/fundByCard", fundAccountByCard);
transaction.post("/sendingFunds", sendingFundsToUsers)
transaction.post("/withdrawalFunds", withdrawalOfFunds)

export default transaction;