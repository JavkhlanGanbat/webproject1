import express from 'express';
import { BookService } from '../services/bookService.js';

const router = express.Router();

router.get('/api/books', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = 'all', sort = 'price_asc' } = req.query;
        const { rows } = await BookService.getBooks(page, limit, search, category, sort);
        
        const totalBooks = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const books = rows.map(({ total_count, ...book }) => book);

        res.json({
            books,
            total: totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: parseInt(page),
            filters: { search, category, sort }
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/api/books/:id', async (req, res) => {
    try {
        const { rows } = await BookService.getBookById(req.params.id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const booksRouter = router;
