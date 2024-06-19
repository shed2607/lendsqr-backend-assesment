# Backend Assessment Project

ER diagram

![Blank diagram](https://github.com/shed2607/lendsqr-backend-assesment/assets/87262901/f985d4be-6abd-41c7-b5c5-7aaa32fe444e)



## Description
This project is a backend application built with Node.js and Express.js. It provides functionalities for user authentication, transaction handling, and database operations using MySQL via Knex.js.

## Prerequisites
Before running the application, ensure you have the following installed:
- Node.js (version >= 14.0.0)
- npm (Node Package Manager) or yarn
- MySQL database

## Installation
1. Clone the repository:
```bash
git clone https://github.com/shed2607/lendsqr-backend-assesment.git
cd backend-assessment
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lensqr
PORT=3000
JWT_SECRET=your_jwt_secret
```

## Configuration
- **tsconfig.json**: TypeScript compiler options for module resolution and compilation settings.
- **nodemon.json**: Nodemon configuration for watching TypeScript files and restarting the server.

## Usage
- Start the application in development mode:
```bash
npm run dev
# or
yarn dev
```
This command uses `nodemon` to watch for file changes and automatically restarts the server.

## Endpoints
### Authentication
- `POST /auth/createUser`: Register a new user.
- `POST /auth/loginUser`: Authenticate and log in a user.

### Transactions
- `POST /transaction/fundByCard`: Fund an account using a card.
- `POST /transaction/sendingFunds`: Transfer funds between users.
- `POST /transaction/withdrawalFunds`: Withdraw funds from an account.

## Technologies Used
- Node.js
- Express.js
- MySQL (via Knex.js)
- TypeScript
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- cors for enabling CORS in Express


## Authors
- Oluwaseun Adeniyi (@shed2607) - [Your Website](https://www.oluwaseungozie.com.ng/)

## Acknowledgments
- Mention any libraries or resources that inspired your code or were helpful.
