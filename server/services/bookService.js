import { pool } from '../db.js';

export class BookService {
    static buildFilterQuery(search, category) {
        const conditions = [];
        const values = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(LOWER(title) LIKE LOWER($${values.length}) 
                OR LOWER(author) LIKE LOWER($${values.length})
                OR LOWER(description) LIKE LOWER($${values.length}))`);
        }

        if (category !== 'all') {
            values.push(category);
            conditions.push(`LOWER(category) = LOWER($${values.length})`);
        }

        return { conditions, values };
    }

    static async getBooks(page = 1, limit = 10, search = '', category = 'all', sort = 'price_asc') {
        const { conditions, values } = this.buildFilterQuery(search, category);
        const orderBy = sort === 'price_desc' ? 'price DESC NULLS LAST' : 'price ASC NULLS LAST';
        
        const query = `
            WITH filtered_books AS (
                SELECT *
                FROM books
                WHERE 1=1 ${conditions.length ? 'AND ' + conditions.join(' AND ') : ''}
            )
            SELECT *, COUNT(*) OVER() as total_count
            FROM filtered_books
            ORDER BY ${orderBy}
            LIMIT $${values.length + 1}
            OFFSET $${values.length + 2}
        `;

        values.push(limit, (page - 1) * limit);
        return pool.query(query, values);
    }

    static async getBookById(id) {
        return pool.query('SELECT * FROM books WHERE id = $1', [id]);
    }
}
