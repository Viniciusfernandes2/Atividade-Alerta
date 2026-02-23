/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { buscarDashboard } from "../services/alertaService";
import { tiposAlerta } from "../types/Alerta";
import "./Dashboard.css";

interface PorTipo {
  tipo: string;
  total: string;
}

interface PorTipoComCores extends PorTipo {
  label: string;
  cor: string;
}

interface AlertaRecente {
  id: number;
  tipo: string;
  descricao: string;
  local: string;
  data: string;
  status: string;
}

interface DashboardData {
  total: number;
  ativos: number;
  resolvidos: number;
  porTipo: PorTipo[];
  recentes: AlertaRecente[];
}

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const navigate = useNavigate();
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    carregarDashboard();
  }, [navigate]);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      const data = await buscarDashboard();
      
      // Verificar se os dados são válidos
      if (!data) {
        throw new Error("Dados não recebidos");
      }

      // Transformar os dados garantindo a tipagem correta
      const transformedData: DashboardData = {
        total: data.total || 0,
        ativos: data.ativos || 0,
        resolvidos: data.resolvidos || 0,
        porTipo: Array.isArray(data.porTipo) ? data.porTipo : [],
        recentes: Array.isArray(data.recentes) 
          ? data.recentes.map((alerta: any) => ({
              id: Number(alerta.id),
              tipo: String(alerta.tipo || ''),
              descricao: String(alerta.descricao || ''),
              local: String(alerta.local || ''),
              data: String(alerta.data || new Date().toISOString()),
              status: String(alerta.status || 'ativo')
            }))
          : []
      };
      
      setDados(transformedData);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setErro("Não foi possível carregar os dados do dashboard");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando dashboard...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="dashboard-container">
        <div className="erro">{erro}</div>
        <button onClick={carregarDashboard} className="btn-tentar-novamente">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="dashboard-container">
        <div className="loading">Nenhum dado disponível</div>
      </div>
    );
  }

  // Preparar dados para o gráfico de pizza
  const tiposComCores = dados.porTipo.map((item: PorTipo) => {
    const tipoInfo = tiposAlerta.find(t => t.valor === item.tipo) || { 
      label: item.tipo || 'Desconhecido', 
      cor: '#95a5a6' 
    };
    return {
      ...item,
      label: tipoInfo.label,
      cor: tipoInfo.cor
    };
  });

  const dadosPie = {
    labels: tiposComCores.map((item: PorTipoComCores) => item.label),
    datasets: [
      {
        data: tiposComCores.map((item: PorTipoComCores) => parseInt(item.total) || 0),
        backgroundColor: tiposComCores.map((item: PorTipoComCores) => item.cor),
        borderWidth: 0,
      },
    ],
  };

  // Preparar dados para o gráfico de barras - VERSÃO AMPLIADA
  const dadosBar = {
    labels: ['Ativos', 'Resolvidos', 'Total'],
    datasets: [
      {
        label: 'Quantidade de Alertas',
        data: [
          dados.ativos || 0, 
          dados.resolvidos || 0, 
          dados.total || 0
        ],
        backgroundColor: ['#f39c12', '#2ecc71', '#3498db'],
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const opcoesPie = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          color: '#fff', 
          font: { size: 12 },
          boxWidth: 12,
          padding: 10
        }
      },
      title: {
        display: true,
        text: 'Alertas por Tipo',
        color: '#fff',
        font: { size: 16, weight: 'bold' as const },
        padding: { bottom: 15 }
      },
      tooltip: {
        backgroundColor: '#08361d',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2f80ed',
        borderWidth: 1
      }
    },
  };

  const opcoesBar = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Visão Geral',
        color: '#fff',
        font: { size: 18, weight: 'bold' as const },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: '#08361d',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#2f80ed',
        borderWidth: 1,
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { 
          color: '#fff', 
          stepSize: 1, 
          font: { size: 12 },
          padding: 8
        },
        title: {
          display: true,
          text: 'Quantidade',
          color: '#aaa',
          font: { size: 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#fff', 
          font: { size: 14, weight: 'bold' as const },
          padding: 8
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
  };

  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      if (isNaN(data.getTime())) {
        return 'Data inválida';
      }
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'ativo' ? 'status-ativo' : 'status-resolvido';
  };

  const getStatusText = (status: string) => {
    return status === 'ativo' ? 'Ativo' : 'Resolvido';
  };

  const getTipoLabel = (tipo: string) => {
    const tipoInfo = tiposAlerta.find(t => t.valor === tipo);
    return tipoInfo?.label || tipo || 'Desconhecido';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Dashboard de Alertas</h1>
        <div className="header-actions">
          <Link to="/criar-alerta" className="btn-criar">
            + Criar Alerta
          </Link>
          <Link to="/lista-alertas" className="btn-listar">
            📋 Listar Alertas
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }} 
            className="btn-sair"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="cards-container">
        <div className="card total">
          <div className="card-icon">📊</div>
          <div className="card-info">
            <span className="card-label">Total de Alertas</span>
            <span className="card-value">{dados.total}</span>
          </div>
        </div>
        <div className="card ativos">
          <div className="card-icon">⚠️</div>
          <div className="card-info">
            <span className="card-label">Alertas Ativos</span>
            <span className="card-value">{dados.ativos}</span>
          </div>
        </div>
        <div className="card resolvidos">
          <div className="card-icon">✅</div>
          <div className="card-info">
            <span className="card-label">Alertas Resolvidos</span>
            <span className="card-value">{dados.resolvidos}</span>
          </div>
        </div>
      </div>

      <div className="graficos-container">
        {/* Gráfico de Pizza - mantém 300x300 */}
        <div className="grafico-card">
          <div className="grafico-wrapper pie-chart">
            {dados.porTipo.length > 0 ? (
              <Pie data={dadosPie} options={opcoesPie} />
            ) : (
              <p className="sem-dados">Nenhum dado para exibir</p>
            )}
          </div>
        </div>
        
        {/* Gráfico de Barras - AMPLIADO */}
        <div className="grafico-card">
          <div className="grafico-wrapper bar-chart">
            <Bar data={dadosBar} options={opcoesBar} />
          </div>
        </div>
      </div>

      <div className="recentes-container">
        <h2>📋 Últimos Alertas</h2>
        <div className="tabela-recentes">
          {dados.recentes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Local</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dados.recentes.map((alerta: AlertaRecente) => (
                  <tr key={alerta.id}>
                    <td>
                      <span className={`tipo-badge tipo-${alerta.tipo}`}>
                        {getTipoLabel(alerta.tipo)}
                      </span>
                    </td>
                    <td>{alerta.descricao.substring(0, 50)}...</td>
                    <td>{alerta.local}</td>
                    <td>{formatarData(alerta.data)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(alerta.status)}`}>
                        {getStatusText(alerta.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="sem-dados">Nenhum alerta cadastrado</p>
          )}
        </div>
        <div className="ver-todos">
          <Link to="/lista-alertas" className="link-ver-todos">
            Ver todos os alertas →
          </Link>
        </div>
      </div>
    </div>
  );
}