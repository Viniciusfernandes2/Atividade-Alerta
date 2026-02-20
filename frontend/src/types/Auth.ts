export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}