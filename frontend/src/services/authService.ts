import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/Auth";

const api = axios.create({
  baseURL: "http://localhost:3000", // ajuste para sua API
});

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

import type { RegisterRequest } from "../types/Auth";

export const register = async (data: RegisterRequest) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export default api;