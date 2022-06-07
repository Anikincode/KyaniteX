import { Client, Pool } from "pg";

let conn;

const PGSQL_USER = 'postgres';
const PGSQL_PASSWORD = 'postgres';
const PGSQL_HOST = '127.0.0.1';
const PGSQL_PORT = '5432';
const PGSQL_DATABASE = 'kyanitex';

if (!conn) {
    conn = new Pool({
        user: PGSQL_USER,
        password: PGSQL_PASSWORD,
        host: PGSQL_HOST,
        port: PGSQL_PORT,
        database: PGSQL_DATABASE,
    });
}

export default conn;