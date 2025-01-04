import express from 'express';
import { 
    getAllBooks, 
    getBookById, 
    createBook, 
    updateBook, 
    deleteBook 
} from '../controllers/booksController.js';

const router = express.Router();

// Define route prefix
const BASE_PATH = '/books';

router.get(BASE_PATH, getAllBooks);
router.get(`${BASE_PATH}/:id`, getBookById);
router.post(BASE_PATH, createBook);
router.put(`${BASE_PATH}/:id`, updateBook);
router.delete(`${BASE_PATH}/:id`, deleteBook);

export const booksRouter = router;
