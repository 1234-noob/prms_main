import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Dispute } from '../entities/Dispute'; // add more entities as needed
import { Maintenance } from '../entities/Maintenance';
import { Contact } from '../entities/Contact';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'help_support_db',
    synchronize: true, //
    logging: false,
    entities: [Dispute,Maintenance,Contact],
    migrations: [],
    subscribers: [],
});

// Initialize and log service connection
AppDataSource.initialize()
    .then(() => {
        console.log('✅ [Help & Support Service] MySQL database connected successfully!');
    })
    .catch((error) => {
        console.error('❌ [Help & Support Service] Failed to connect to MySQL database:', error);
    });
