import knex from "knex";

// Initialize knex instance with MySQL configuration
export const knexdb = knex({
    client: 'mysql',                    // Using MySQL database client
    connection: {
        host: 'localhost',              // MySQL server host
        port: 3306,                     // MySQL server port
        user: 'root',                   // MySQL username
        password: 'seun1234',           // MySQL password
        database: 'lensqr'              // MySQL database name
    },
});
