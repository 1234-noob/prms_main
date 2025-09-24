import app from './app';
import { AppDataSource } from './database/data-source';

const PORT = process.env.PORT || 3005;

AppDataSource.initialize()
    .then(() => {
        console.log('📦 Database connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ DB Connection Error:', err);
    });
