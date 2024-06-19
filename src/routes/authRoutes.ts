import express, { Express, Request, Response, Router } from "express";
import { createUser, loginUser } from ".././controller/authController";

const auth: Router = Router();

auth.post("/createUser", createUser);
auth.post("/loginUser", loginUser);

export default auth;