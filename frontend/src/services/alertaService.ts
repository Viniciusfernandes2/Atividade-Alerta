import axios from "axios";
import type { Alerta, AlertaRequest } from "../types/Alerta";

const api = axios.create({
  baseURL: "http://localhost:3001", // porta do backend
});

export const criarAlerta = async (data: AlertaRequest): Promise<Alerta> => {
  const response = await api.post("/alertas", data);
  return response.data;
};

export const listarAlertas = async (): Promise<Alerta[]> => {
  const response = await api.get("/alertas");
  return response.data;
};

export const filtrarPorTipo = async (tipo: string): Promise<Alerta[]> => {
  const response = await api.get(`/alertas/tipo/${tipo}`);
  return response.data;
};

export const atualizarStatus = async (id: number, status: string): Promise<Alerta> => {
  const response = await api.put(`/alertas/${id}`, { status });
  return response.data;
};

export const buscarDashboard = async (): Promise<{ tipo: string; count: string }[]> => {
  const response = await api.get("/alertas/dashboard");
  return response.data;
};

export default api;