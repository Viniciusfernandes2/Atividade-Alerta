import { Pool } from "pg";

export const pool = new Pool({

user: "postgres",
host: "localhost",

database: "alertas_db",

password: "SUA_SENHA",

port: 5432,

});