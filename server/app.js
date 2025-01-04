import express from 'express';
import { booksRouter } from './routes/books.js';
import { setupStaticMiddleware, setupDefaultRoute } from './middleware/static.js';
import { swaggerDocs, swaggerUi, swaggerUiOptions } from '../swaggerDocs.js';

export const createApp = () => {
    const app = express();

    // Basic middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // CORS headers with explicit OPTIONS handling
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        
        // Handle OPTIONS method
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    // API and Documentation routes BEFORE static middleware
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));
    app.use('/api', booksRouter);

    // Static and catch-all routes LAST
    setupStaticMiddleware(app);
    setupDefaultRoute(app);

    return app;
};
