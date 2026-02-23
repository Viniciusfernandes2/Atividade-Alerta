import { Request, Response } from "express";
import * as service from "../services/alertaService";

export const criar = async (req: Request, res: Response) => {
    try {
        const { tipo, descricao, local, data } = req.body;

        if (!tipo || !descricao || !local || !data) {
            return res.status(400).json({
                erro: "Campos obrigatórios: tipo, descricao, local, data"
            });
        }

        const alerta = await service.criar({
            tipo,
            descricao,
            local,
            data
        });

        return res.status(201).json(alerta);
    }
    catch (error) {
        console.error("Erro ao criar alerta:", error);
        return res.status(500).json({
            erro: "Erro ao criar alerta"
        });
    }
};

export const listar = async (req: Request, res: Response) => {
    try {
        const alertas = await service.listar();
        return res.json(alertas);
    }
    catch (error) {
        console.error("Erro ao listar alertas:", error);
        return res.status(500).json({
            erro: "Erro ao listar alertas"
        });
    }
};

export const filtrar = async (req: Request<{ tipo: string }>, res: Response) => {
    try {
        const { tipo } = req.params;
        const alertas = await service.filtrar(tipo);
        return res.json(alertas);
    }
    catch (error) {
        console.error("Erro ao filtrar alertas:", error);
        return res.status(500).json({
            erro: "Erro ao filtrar alertas"
        });
    }
};

export const atualizar = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { tipo, descricao, local, data, status } = req.body;

        const alerta = await service.atualizar(id, {
            tipo,
            descricao,
            local,
            data,
            status
        });

        if (!alerta) {
            return res.status(404).json({
                erro: "Alerta não encontrado"
            });
        }

        return res.json(alerta);
    }
    catch (error) {
        console.error("Erro ao atualizar alerta:", error);
        return res.status(500).json({
            erro: "Erro ao atualizar alerta"
        });
    }
};

export const atualizarStatus = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (!status || (status !== 'ativo' && status !== 'resolvido')) {
            return res.status(400).json({
                erro: "Status deve ser 'ativo' ou 'resolvido'"
            });
        }

        const alerta = await service.atualizarStatus(id, status);
        
        if (!alerta) {
            return res.status(404).json({
                erro: "Alerta não encontrado"
            });
        }

        return res.json(alerta);
    }
    catch (error) {
        console.error("Erro ao atualizar status:", error);
        return res.status(500).json({
            erro: "Erro ao atualizar status do alerta"
        });
    }
};

export const dashboard = async (req: Request, res: Response) => {
    try {
        const dados = await service.dashboard();
        return res.json(dados);
    }
    catch (error) {
        console.error("Erro no dashboard:", error);
        return res.status(500).json({
            erro: "Erro ao carregar dashboard"
        });
    }
};