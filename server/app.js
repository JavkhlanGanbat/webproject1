import express from 'express';
import { booksRouter } from './routes/books.js';
import { setupStaticMiddleware, setupDefaultRoute } from './middleware/static.js';

export const createApp = () => {
    const app = express();

    // Setup middleware
    app.use(express.json());  // This MUST come before route handlers
    app.use(express.urlencoded({ extended: true }));
    
    // Add CORS headers if needed
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    setupStaticMiddleware(app);

    // Setup API routes
    app.use('/api', booksRouter);  // Add /api prefix here

    // Setup default route (should be last)
    setupDefaultRoute(app);

    return app;
};
