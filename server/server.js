import { createApp } from './app.js';
import { config } from './config/config.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = createApp();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0'
        }
    },
    apis: [
        // Update the path(s) if necessary:
        './routes/*.js',
        './controllers/*.js'
    ]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`http://localhost:${config.port}`);
});
