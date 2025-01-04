import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
    port: process.env.PORT || 3000,
    projectRoot: path.join(__dirname, '..'),
    clientPath: path.join(__dirname, '../client')
};
