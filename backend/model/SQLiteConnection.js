import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function openDatabase(dbName) {
    return open({
        filename: `./${dbName}.sqlite`,
        driver: sqlite3.Database,
    });
}
