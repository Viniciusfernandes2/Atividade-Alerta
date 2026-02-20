import axios from "axios";
import type { 
  RegisterRequest, 
  RegisterResponse, 
  LoginRequest, 
  LoginResponse,
  Usuario 
} from "../types/Usuario";

const api = axios.create({
  baseURL: "http://localhost:3001", // porta do backend
});

// ========== SERVIÇOS DE AUTENTICAÇÃO ==========

/**
 * Registra um novo usuário
 * @param data Dados do usuário (nome, email, senha)
 * @returns Dados do usuário criado
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await api.post("/usuarios/cadastro", data);
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};

/**
 * Realiza login do usuário
 * @param data Credenciais (email, senha)
 * @returns Dados do usuário e token
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post("/usuarios/login", data);
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

// ========== SERVIÇOS DE GERENCIAMENTO DE USUÁRIO ==========

/**
 * Lista todos os usuários (apenas para administração)
 * @returns Lista de usuários
 */
export const listarUsuarios = async (): Promise<Usuario[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    throw error;
  }
};

/**
 * Busca um usuário por ID
 * @param id ID do usuário
 * @returns Dados do usuário
 */
export const buscarUsuarioPorId = async (id: number): Promise<Usuario> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

/**
 * Deleta um usuário
 * @param id ID do usuário a ser deletado
 */
export const deletarUsuario = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
};

// ========== UTILITÁRIOS DE AUTENTICAÇÃO ==========

/**
 * Verifica se o usuário está autenticado
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  try {
    // Verifica se o token expirou
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = payload.exp * 1000 < Date.now();
    
    if (expirado) {
      localStorage.removeItem("token");
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Retorna o token armazenado
 * @returns string | null
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Faz logout do usuário
 */
export const logout = (): void => {
  localStorage.removeItem("token");
};

// Configura interceptador para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configura interceptador para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;