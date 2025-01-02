import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'book',
    password: process.env.DB_PASSWORD || 'webapp',
    port: process.env.DB_PORT || 5432,
});
