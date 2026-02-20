export interface Alerta {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: string;
  status?: string;
  data?: Date;
}

export interface AlertaRequest {
  titulo: string;
  descricao: string;
  tipo: string;
}

export interface AlertaDashboard {
  tipo: string;
  count: string;
}