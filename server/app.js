import express from 'express';
import { booksRouter } from './routes/books.js';
import { setupStaticMiddleware, setupDefaultRoute } from './middleware/static.js';

export const createApp = () => {
    const app = express();

    // Setup middleware
    setupStaticMiddleware(app);

    // Setup routes
    app.use(booksRouter);

    // Setup default route
    setupDefaultRoute(app);

    return app;
};
