import { pool } from "../database/connection";

export interface Alerta {
    id?: number;
    tipo: string;
    descricao: string;
    local: string;
    data: string;
    status?: string;
}

export const criar = async (alerta: Alerta) => {
    const result = await pool.query(
        `INSERT INTO alertas (tipo, descricao, local, data, status)
         VALUES ($1, $2, $3, $4, 'ativo')
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
         ORDER BY data DESC, id DESC`
    );
    return result.rows;
};

export const filtrar = async (tipo: string) => {
    const result = await pool.query(
        `SELECT * FROM alertas
         WHERE tipo = $1
         ORDER BY data DESC, id DESC`,
        [tipo]
    );
    return result.rows;
};

export const atualizar = async (
    id: number,
    alerta: Partial<Alerta>
) => {
    const result = await pool.query(
        `UPDATE alertas
         SET tipo = COALESCE($1, tipo),
             descricao = COALESCE($2, descricao),
             local = COALESCE($3, local),
             data = COALESCE($4, data),
             status = COALESCE($5, status)
         WHERE id = $6
         RETURNING *`,
        [
            alerta.tipo,
            alerta.descricao,
            alerta.local,
            alerta.data,
            alerta.status,
            id
        ]
    );
    return result.rows[0];
};

export const atualizarStatus = async (id: number, status: 'ativo' | 'resolvido') => {
    const result = await pool.query(
        `UPDATE alertas
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );
    return result.rows[0];
};

export const dashboard = async () => {
    // Estatísticas por tipo
    const porTipo = await pool.query(
        `SELECT tipo, COUNT(*) as total
         FROM alertas
         GROUP BY tipo
         ORDER BY total DESC`
    );

    // Total de alertas ativos
    const ativos = await pool.query(
        `SELECT COUNT(*) as total
         FROM alertas
         WHERE status = 'ativo'`
    );

    // Total de alertas resolvidos
    const resolvidos = await pool.query(
        `SELECT COUNT(*) as total
         FROM alertas
         WHERE status = 'resolvido'`
    );

    // Total geral
    const total = await pool.query(
        `SELECT COUNT(*) as total FROM alertas`
    );

    // Últimos 5 alertas
    const recentes = await pool.query(
        `SELECT * FROM alertas
         ORDER BY data DESC, id DESC
         LIMIT 5`
    );

    return {
        porTipo: porTipo.rows,
        ativos: parseInt(ativos.rows[0].total),
        resolvidos: parseInt(resolvidos.rows[0].total),
        total: parseInt(total.rows[0].total),
        recentes: recentes.rows
    };
};