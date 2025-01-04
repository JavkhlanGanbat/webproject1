import express from 'express';
import path from 'path';
import { config } from '../config.js';

export const setupStaticMiddleware = (app) => {
    app.use(express.static(config.projectRoot));
    app.use(express.json());
};

export const setupDefaultRoute = (app) => {
    app.get('*', (req, res) => {
        res.sendFile(path.join(config.projectRoot, 'index.html'));
    });
};
