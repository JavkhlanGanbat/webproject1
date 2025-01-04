import express from 'express';
import { pool } from '../db.js';
import {
    getAllBooks,
    getBookById,
    createBook,
    deleteBook
} from '../controllers/booksController.js';

const router = express.Router();

router.get('/books', getAllBooks);

router.get('/books/:id', getBookById);

router.post('/books', createBook);

router.delete('/books/:id', deleteBook);

export const booksRouter = router;
