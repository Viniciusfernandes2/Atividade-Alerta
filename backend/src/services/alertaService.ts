import { pool } from "../database/connection";

interface Alerta {

    tipo: string;
    descricao: string;
    local: string;
    data: string;

}


export const criar = async (alerta: Alerta) => {

    const result = await pool.query(

        `INSERT INTO alertas (tipo, descricao, local, data)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,

        [
            alerta.tipo,
            alerta.descricao,
            alerta.local,
            alerta.data
        ]

    );

    return result.rows[0];

};


export const listar = async () => {

    const result = await pool.query(

        `SELECT * FROM alertas
         ORDER BY id DESC`

    );

    return result.rows;

};


export const filtrar = async (tipo: string) => {

    const result = await pool.query(

        `SELECT * FROM alertas
         WHERE tipo = $1`,

        [tipo]

    );

    return result.rows;

};


export const atualizar = async (

    id: number,
    alerta: Alerta

) => {

    const result = await pool.query(

        `UPDATE alertas
         SET tipo = $1,
             descricao = $2,
             local = $3,
             data = $4
         WHERE id = $5
         RETURNING *`,

        [
            alerta.tipo,
            alerta.descricao,
            alerta.local,
            alerta.data,
            id
        ]

    );

    return result.rows[0];

};


export const dashboard = async () => {

    const result = await pool.query(

        `SELECT tipo, COUNT(*) as total
         FROM alertas
         GROUP BY tipo
         ORDER BY total DESC`

    );

    return result.rows;

};