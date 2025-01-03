import { createApp } from './app.js';
import { config } from './config/config.js';

const app = createApp();

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`http://localhost:${config.port}`);
});
