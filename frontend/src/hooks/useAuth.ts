export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  message?: string;
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
    role?: string;
  };
  token: string;
  message?: string;
}

export interface AuthError {
  erro: string;
  status?: number;
}

export interface RecuperacaoSenhaRequest {
  email: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
}