import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export class Database {
    static async openDB() {
        return open({
            filename: './database.db',
            driver: sqlite3.Database,
        });
    }
}