import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { CreateUserRequest, User } from "../config/typeconfig";
import createToken from "../middleware/jwtconfig";
import { knexdb } from "../config/dbconfig";

const blackListUrl = "https://adjutor.lendsqr.com/v2/verification/karma/"

// Assuming asyncHandler is defined somewhere as middleware for async routes
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password }: CreateUserRequest = req.body;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        // Check karma URL
        const karmaCheckUrl = `${blackListUrl}${email}`;
        const karmaResponse = await fetch(karmaCheckUrl, {
            headers: {
                'Authorization': 'Bearer sk_live_ArAcEriTQ2vgqVu5WDd86FfUwKLiev4cWz6pmBLY'
            }
        });;
        const karmaData = await karmaResponse.json();

        if (karmaData.message == 'Successful') {
            // If karma check fails, delete the user
            res.status(400).json({ error: "Karma verification failed" });
            return;
        }


        // Generate account number (ensure uniqueness)
        let accountNumber: number;
        do {
            accountNumber = Math.floor(100000 + Math.random() * 900000);
        } while (await isAccountNumberExists(accountNumber));

        // Hash password (assuming bcrypt is used)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database (assuming you have a function or ORM for this)
        const savedUser = await knexdb('User').insert({
            'First Name': firstName,
            'Last Name': lastName,
            'Password': hashedPassword,
            "Email": email,
            'Account Number': accountNumber,
            'Account Balance': 0.00 // Assuming initial account balance is 0.00
        });


        res.status(201).json(savedUser); // Respond with saved user details
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


const isAccountNumberExists = async (accountNumber: number): Promise<boolean> => {
    try {
        const result = await knexdb('User')
            .select('Account Number')
            .where('Account Number', accountNumber)
            .first();

        return !!result; // If result is not null/undefined, the account number exists
    } catch (err) {
        console.error('Error checking account number existence:', err);
        throw err;
    }
};

// Assuming asyncHandler is defined somewhere as middleware for async routes
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { accountNumber, password } = req.body;

        if (!accountNumber || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        // Fetch user from database based on account number
        const user = await knexdb('User').where({ 'Account Number': accountNumber }).first();

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Compare password hash
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        // Karma check
        const karmaCheckUrl = `${blackListUrl}${user.Email}`;
        const karmaResponse = await fetch(karmaCheckUrl, {
            headers: {
                'Authorization': 'Bearer sk_live_ArAcEriTQ2vgqVu5WDd86FfUwKLiev4cWz6pmBLY'
            }
        });;
        const karmaData = await karmaResponse.json();

        if (karmaData.message == 'Successful') {
            // If karma check fails, delete the user
            res.status(400).json({ error: "Karma verification failed" });
            return;
        }

        // Password is correct, prepare user data to send back (excluding sensitive info like password)
        const userResponse = {
            id: user.ID,
            firstName: user['First Name'],
            lastName: user['Last Name'],
            accountNumber: user['Account Number'],
            accountBalance: user['Account Balance']
        };

        const token = createToken(userResponse);

        res.status(200).json({
            user: userResponse,
            token: token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



