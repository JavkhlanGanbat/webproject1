import express from 'express';
import { pool } from '../db/config.js';

const router = express.Router();

router.get('/api/books', async (req, res) => {
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

router.get('/api/books/:id', async (req, res) => {
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

export const booksRouter = router;
