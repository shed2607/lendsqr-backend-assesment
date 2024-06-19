export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    // Add more fields as needed
}

export interface User {

    id: number,
    firstName: string,
    lastName: string,
    accountNumber: number,
    accountBalance: number

}

export interface Card {
    cardNumber: string; // Card number is typically a string due to its alphanumeric nature
    cardHolderName: string; // Name of the cardholder
    expiryDate: string; // Expiry date of the card (typically a string in MM/YY format)
    cvv: string; // Card Verification Value (CVV)
}
