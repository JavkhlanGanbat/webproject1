import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/books', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = 'all', sort = 'price_asc' } = req.query;
        
        console.log('Database Query Parameters:', {
            page,
            limit,
            search,
            category,
            sort,
            values: [] // Add your query values here
        });

        const orderBy = sort === 'price_desc' ? 'price DESC NULLS LAST' : 'price ASC NULLS LAST';

        let query = `
            WITH filtered_books AS (
                SELECT *
                FROM books
                WHERE 1=1
                ${search ? `
                    AND (
                        LOWER(title) LIKE LOWER($1) 
                        OR LOWER(author) LIKE LOWER($1)
                        OR LOWER(description) LIKE LOWER($1)
                    )
                ` : ''}
                ${category !== 'all' ? `
                    AND LOWER(category) = LOWER($${search ? '2' : '1'})
                ` : ''}
            )
            SELECT 
                *,
                COUNT(*) OVER() as total_count
            FROM filtered_books
            ORDER BY ${orderBy}
            LIMIT $${category !== 'all' ? (search ? '3' : '2') : (search ? '2' : '1')}
            OFFSET $${category !== 'all' ? (search ? '4' : '3') : (search ? '3' : '2')}
        `;

        const values = [];
        if (search) values.push(`%${search}%`);
        if (category !== 'all') values.push(category);
        values.push(limit, (page - 1) * limit);

        console.log('Executing SQL:', query);
        const { rows } = await pool.query(query, values);
        console.log(`Found ${rows.length} results`);
        
        const totalBooks = rows.length > 0 ? parseInt(rows[0].total_count) : 0;

        res.json({
            books: rows.map(row => {
                const { total_count, ...book } = row;
                return book;
            }),
            total: totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: parseInt(page),
            filters: {
                search,
                category,
                sort
            }
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM books WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        
        if (rows.length === 0) {

            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/books', async (req, res) => {
    try {
        console.log('Received book data:', req.body); // Add logging
        const book = req.body;
        const query = `
            INSERT INTO books (
                title, author, price, category, isbn, publish_date, 
                publisher, language, pages, format, description, 
                cover_image, rating, reviews, in_stock
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        const values = [
            book.title, book.author, book.price, book.category, 
            book.isbn, book.publish_date, book.publisher, book.language,
            book.pages, book.format, book.description, book.cover_image,
            book.rating, book.reviews, book.in_stock
        ];
        
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error adding book:', err);
        res.status(500).json({ 
            error: err.message,
            details: err.stack // Add stack trace for debugging
        });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM books WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ error: err.message });
    }
});

export const booksRouter = router;
