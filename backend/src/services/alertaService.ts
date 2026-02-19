import { pool } from "../database/connection";
import { Alerta } from "../models/Alerta";

export const criarAlerta = async (alerta: Alerta) => {

const result = await pool.query(

"INSERT INTO alertas (titulo, descricao, tipo) VALUES ($1,$2,$3) RETURNING *",

[alerta.titulo, alerta.descricao, alerta.tipo]

);

return result.rows[0];

};

export const listarAlertas = async () => {

const result = await pool.query(

"SELECT * FROM alertas ORDER BY data DESC"

);

return result.rows;

};

export const filtrarTipo = async (tipo: string) => {

const result = await pool.query(

"SELECT * FROM alertas WHERE tipo=$1",

[tipo]

);

return result.rows;

};

export const atualizarStatus = async (id: number, status: string) => {

const result = await pool.query(

"UPDATE alertas SET status=$1 WHERE id=$2 RETURNING *",

[status, id]

);

return result.rows[0];

};

export const dashboard = async () => {

const result = await pool.query(

"SELECT tipo, COUNT(*) FROM alertas GROUP BY tipo"

);

return result.rows;

};