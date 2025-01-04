import { pool } from '../db.js';

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Retrieve a list of books
 *     description: Retrieve a paginated list of books with optional filtering and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering books by title, author, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, fiction, non-fiction, science, history, technology]
 *         description: Filter books by category
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc]
 *         description: Sort books by price
 *     responses:
 *       200:
 *         description: Successfully retrieved list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 total:
 *                   type: integer
 *                   description: Total number of books matching the criteria
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                 filters:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                     category:
 *                       type: string
 *                     sort:
 *                       type: string
 *             example:
 *               books: [
 *                 {
 *                   id: 1,
 *                   title: "The Great Gatsby",
 *                   author: "F. Scott Fitzgerald",
 *                   price: 9.99,
 *                   category: "fiction"
 *                 }
 *               ]
 *               total: 1
 *               totalPages: 1
 *               currentPage: 1
 *               filters: {
 *                 search: "",
 *                 category: "all",
 *                 sort: "price_asc"
 *               }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function getAllBooks(req, res) {
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
}

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get a book by ID
 *     description: Retrieve detailed information about a specific book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function getBookById(req, res) {
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
}
/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     description: Delete a book from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function deleteBook(req, res) {
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
}

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book
 *     description: Update an existing book's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const book = req.body;
        
        const query = `
            UPDATE books 
            SET 
                title = $1, 
                author = $2, 
                price = $3, 
                category = $4,
                isbn = $5,
                publish_date = $6,
                publisher = $7,
                language = $8,
                pages = $9,
                format = $10,
                description = $11,
                cover_image = $12,
                rating = $13,
                reviews = $14,
                in_stock = $15
            WHERE id = $16
            RETURNING *
        `;
        
        const values = [
            book.title,
            book.author,
            book.price,
            book.category,
            book.isbn,
            book.publish_date,
            book.publisher,
            book.language,
            book.pages,
            book.format,
            book.description,
            book.cover_image,
            book.rating,
            book.reviews,
            book.in_stock,
            id
        ];

        const { rows } = await pool.query(query, values);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(500).json({ error: err.message });
    }
}
/**
 * @openapi
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Create a new book
 *     description: Add a new book to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             title: "New Book Title"
 *             author: "Author Name"
 *             price: 29.99
 *             category: "fiction"
 *             isbn: "978-1234567890"
 *             publish_date: "2023-01-01"
 *             publisher: "Publisher Name"
 *             language: "English"
 *             pages: 300
 *             format: "Hardcover"
 *             description: "Book description here"
 *             cover_image: "https://example.com/cover.jpg"
 *             rating: 0
 *             reviews: 0
 *             in_stock: true
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function createBook(req, res) {
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
}
