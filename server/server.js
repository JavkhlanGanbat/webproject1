import { createApp } from './app.js';
import { config } from './config/config.js';
import { swaggerDocs, swaggerUi } from './docs/swaggerDocs.js';

const app = createApp();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`http://localhost:${config.port}`);
});
