import { knexdb } from "../../config/dbconfig";
import { Card } from "../../config/typeconfig";

// Function to transfer funds from one account to another
export const transferFunds = async (senderAccountNumber: number, receiverAccountNumber: number, amount: number): Promise<any> => {
    try {
        // Check if sender and receiver account numbers exist
        const senderExists = await knexdb('User')
            .select('Account Number')
            .where('Account Number', senderAccountNumber)
            .first();

        const receiverExists = await knexdb('User')
            .select('Account Number')
            .where('Account Number', receiverAccountNumber)
            .first();

        if (!senderExists) {
            throw new Error(`Sender account number ${senderAccountNumber} does not exist`);
        }

        if (!receiverExists) {
            throw new Error(`Receiver account number ${receiverAccountNumber} does not exist`);
        }

        // Insert transaction into the database for sender (debit)
        await knexdb('Transactions').insert({
            'Account Number': senderAccountNumber,
            'Type': 'Debit',
            'Action': `Sent to user account: ${receiverAccountNumber}`,
            'Amount': amount
        });

        // Insert transaction into the database for receiver (credit)
        await knexdb('Transactions').insert({
            'Account Number': receiverAccountNumber,
            'Type': 'Credit',
            'Action': `Received from user account: ${senderAccountNumber}`,
            'Amount': amount
        });

        // Update sender's account balance
        const senderUser = await knexdb('User')
            .select('Account Balance')
            .where('Account Number', senderAccountNumber)
            .first();

        let senderBalance = parseFloat(senderUser['Account Balance']) - amount;

        await knexdb('User')
            .where('Account Number', senderAccountNumber)
            .update('Account Balance', senderBalance);

        // Update receiver's account balance
        const receiverUser = await knexdb('User')
            .select('Account Balance')
            .where('Account Number', receiverAccountNumber)
            .first();

        let receiverBalance = parseFloat(receiverUser['Account Balance']) + amount;

        await knexdb('User')
            .where('Account Number', receiverAccountNumber)
            .update('Account Balance', receiverBalance);

        return { message: "Transaction and balance update successful" };
    } catch (error) {
        throw error;
    }
};

// Function to fund account by card
export const fundingAccountByCard = async (card: Card, accountNumber: number, amount: number): Promise<any> => {
    try {
        // Check if account number exists
        const accountExists = await knexdb('User')
            .select('Account Number')
            .where('Account Number', accountNumber)
            .first();

        if (!accountExists) {
            throw new Error(`Account number ${accountNumber} does not exist`);
        }

        // Insert transaction into the database
        await knexdb('Transactions').insert({
            'Account Number': accountNumber,
            'Type': 'Credit',
            'Action': "Card funding",
            'Amount': amount
        });

        // Calculate new account balance
        const user = await knexdb('User')
            .select('Account Balance')
            .where('Account Number', accountNumber)
            .first();

        let accountBalance = parseFloat(user['Account Balance']) + amount;

        // Update account balance
        await knexdb('User')
            .where('Account Number', accountNumber)
            .update('Account Balance', accountBalance);

        return { message: "Account funded successfully" };
    } catch (error) {
        throw error;
    }
};

// Function to withdraw funds from an account
export const withdrawFunds = async (senderAccountNumber: number, externalDetails: string, amount: number): Promise<any> => {
    try {
        // Check if sender account number exists
        const senderExists = await knexdb('User')
            .select('Account Number')
            .where('Account Number', senderAccountNumber)
            .first();

        if (!senderExists) {
            throw new Error(`Sender account number ${senderAccountNumber} does not exist`);
        }

        // Insert transaction into the database for the withdrawal
        await knexdb('Transactions').insert({
            'Account Number': senderAccountNumber,
            'Type': 'Debit',
            'Action': `Withdrawal to: ${externalDetails}`,
            'Amount': amount
        });

        // Calculate new sender balance
        const senderUser = await knexdb('User')
            .select('Account Balance')
            .where('Account Number', senderAccountNumber)
            .first();

        let senderBalance = parseFloat(senderUser['Account Balance']) - amount;

        // Update sender's account balance
        await knexdb('User')
            .where('Account Number', senderAccountNumber)
            .update('Account Balance', senderBalance);

        return { message: "Withdrawal transaction and balance update successful" };
    } catch (error) {
        throw error;
    }
};
