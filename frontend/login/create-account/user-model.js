import { Database } from './database.js';

class UserModel{
    static async openDB(){
        return open({
            filename: './database.db',
            driver:sqlite3.Database,
        });
    }
    static async createTable(){
        const db = await this.openDB();
        await db.run(`
            CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL ); 
            `);
    }
    static async getAll() {
        const db = await this.openDb();
        const users =await db.all(`SELECT * FROM users;`);
        return users;
    }

    static async create(user) {
        const db = await Database.openDB();
        await db.run(`
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?);
        `, [user.username, user.email, user.password]);
        console.log("User created successfully");
    }catch(error){
        console.error("Error creating user",error);
        throw error;
    }
}
export default UserModel;