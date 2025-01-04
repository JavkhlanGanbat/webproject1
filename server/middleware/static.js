import express from 'express';
import path from 'path';
import { config } from '../config.js';

export const setupStaticMiddleware = (app) => {
    // Serve static files from client directory
    app.use('/client', express.static(config.clientPath));
    
    // Serve static files from project root for index.html and admin.html
    app.use(express.static(config.projectRoot));
    
    app.use(express.json());
};

export const setupDefaultRoute = (app) => {
    // Special route for admin page
    app.get('/admin', (req, res) => {
        res.sendFile(path.join(config.projectRoot, 'admin.html'));
    });

    // For all other routes, serve index.html
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(config.projectRoot, 'index.html'));
    });
};
