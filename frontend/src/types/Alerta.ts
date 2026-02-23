export interface Alerta {
  id?: number;
  tipo: string;
  descricao: string;
  local: string;
  data: string;
  status: 'ativo' | 'resolvido';
}

export interface AlertaRequest {
  tipo: string;
  descricao: string;
  local: string;
  data: string;
}

export interface AlertaDashboard {
  porTipo: Array<{
    tipo: string;
    total: string;
  }>;
  ativos: number;
  resolvidos: number;
  total: number;
  recentes: Alerta[];
}

export interface DashboardData {
  porTipo: Array<{ tipo: string; total: string }>;
  ativos: number;
  resolvidos: number;
  total: number;
  recentes: Alerta[];
}

export type TipoAlerta = 
  | 'informativo' 
  | 'urgente' 
  | 'critico' 
  | 'manutencao' 
  | 'seguranca';

export const tiposAlerta: { valor: TipoAlerta; label: string; cor: string }[] = [
  { valor: 'informativo', label: 'Informativo', cor: '#3498db' },
  { valor: 'urgente', label: 'Urgente', cor: '#f39c12' },
  { valor: 'critico', label: 'Crítico', cor: '#e74c3c' },
  { valor: 'manutencao', label: 'Manutenção', cor: '#9b59b6' },
  { valor: 'seguranca', label: 'Segurança', cor: '#2ecc71' },
];