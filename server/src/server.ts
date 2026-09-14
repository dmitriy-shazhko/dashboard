import dotenv from 'dotenv';
import { db } from './config/database.js';
import app from './app.js';

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);

const startServer = async () => {
    try {
        await db.one('SELECT 1');
        console.log('Database connection successful');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to database', error);

        await db.$pool.end();

        process.exit(1);
    }
};

startServer();
