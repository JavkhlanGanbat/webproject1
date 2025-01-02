import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { booksRouter } from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from project root
app.use(express.static(projectRoot));
app.use(express.json());

// Use books router
app.use(booksRouter);

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving static files from: ${projectRoot}`);
});
