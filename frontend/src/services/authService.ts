import axios from "axios";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/Auth";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  // Corrigir a rota de /auth/login para /usuarios/login
  const response = await api.post("/usuarios/login", data);
  return response.data;
};

export const register = async (data: RegisterRequest) => {
  // Corrigir também a rota de registro, se necessário
  const response = await api.post("/usuarios/cadastro", data);
  return response.data;
};

export default api;