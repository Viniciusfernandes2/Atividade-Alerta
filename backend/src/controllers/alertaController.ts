import { Request, Response } from "express";
import * as service from "../services/alertaService";

export const criar = async (req: Request, res: Response) => {

  const alerta = await service.criarAlerta(req.body);

  res.json(alerta);

};

export const listar = async (req: Request, res: Response) => {

  const alertas = await service.listarAlertas();

  res.json(alertas);

};

export const filtrar = async (req: Request, res: Response) => {

  const tipo = req.params.tipo as string;

  const alertas = await service.filtrarTipo(tipo);

  res.json(alertas);

};

export const atualizar = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const { status } = req.body;

  const alerta = await service.atualizarStatus(id, status);

  res.json(alerta);

};

export const dashboard = async (req: Request, res: Response) => {

  const dados = await service.dashboard();

  res.json(dados);

};