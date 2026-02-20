export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  token: string;
}