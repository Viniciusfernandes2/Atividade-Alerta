import axios from "axios";
import type { Alerta, AlertaRequest, DashboardData } from "../types/Alerta";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Interceptador para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const atualizarStatus = async (id: number, status: 'ativo' | 'resolvido'): Promise<Alerta> => {
  const response = await api.patch(`/alertas/${id}/status`, { status });
  return response.data;
};

export const buscarDashboard = async (): Promise<DashboardData> => {
  const response = await api.get("/alertas/dashboard");
  return response.data;
};

export default api;