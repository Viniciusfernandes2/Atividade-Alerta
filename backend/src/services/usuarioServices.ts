import { pool } from "../database/connection";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";

const salt = 10;

// criar usuário
export const criarUsuario = async (usuario: Usuario) => {

const hash = await bcrypt.hash(usuario.senha, salt);

const result = await pool.query(

`INSERT INTO usuarios (nome,email,senha)
VALUES ($1,$2,$3)
RETURNING id,nome,email`,

[usuario.nome, usuario.email, hash]

);

return result.rows[0];

};

// buscar por email
export const buscarPorEmail = async (email: string) => {

const result = await pool.query(

"SELECT * FROM usuarios WHERE email=$1",

[email]

);

return result.rows[0];

};

// listar
export const listarUsuarios = async () => {

const result = await pool.query(

"SELECT id,nome,email FROM usuarios"

);

return result.rows;

};

// deletar
export const deletarUsuario = async (id: number) => {

await pool.query(

"DELETE FROM usuarios WHERE id=$1",

[id]

);

};