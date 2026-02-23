import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { listarAlertas, filtrarPorTipo, atualizarStatus } from "../services/alertaService";
import { tiposAlerta, type Alerta } from "../types/Alerta";
import ModalResolver from "../components/ModalResolver";
import "./ListaAlertas.css";

export default function ListaAlertas() {
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtro, setFiltro] = useState<string>("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  
  // Estados para o modal de resolução
  const [modalAberto, setModalAberto] = useState(false);
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    carregarAlertas();
  }, [navigate]);

  useEffect(() => {
    if (filtro === "todos") {
      carregarAlertas();
    } else {
      carregarAlertasFiltrados(filtro);
    }
  }, [filtro]);

  const carregarAlertas = async () => {
    try {
      setCarregando(true);
      const data = await listarAlertas();
      setAlertas(data);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
      setErro("Não foi possível carregar os alertas");
    } finally {
      setCarregando(false);
    }
  };

  const carregarAlertasFiltrados = async (tipo: string) => {
    try {
      setCarregando(true);
      const data = await filtrarPorTipo(tipo);
      setAlertas(data);
      setErro("");
    } catch (error) {
      console.error("Erro ao filtrar alertas:", error);
      setErro("Não foi possível filtrar os alertas");
    } finally {
      setCarregando(false);
    }
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltro(e.target.value);
  };

  const abrirModalResolver = (alerta: Alerta) => {
    setAlertaSelecionado(alerta);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAlertaSelecionado(null);
  };

  const handleResolver = async (motivo: string) => {
    if (!alertaSelecionado?.id) return;

    try {
      setAtualizando(true);
      
      // Aqui você pode salvar o motivo em algum lugar se necessário
      console.log(`Resolvendo alerta ${alertaSelecionado.id} com motivo:`, motivo);
      
      await atualizarStatus(alertaSelecionado.id, 'resolvido');
      
      // Atualizar a lista
      setAlertas(prev => 
        prev.map(alerta => 
          alerta.id === alertaSelecionado.id 
            ? { ...alerta, status: 'resolvido' } 
            : alerta
        )
      );
      
      fecharModal();
    } catch (error) {
      console.error("Erro ao resolver alerta:", error);
      alert("Erro ao resolver alerta. Tente novamente.");
    } finally {
      setAtualizando(false);
    }
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

  const getTipoLabel = (tipo: string) => {
    const tipoInfo = tiposAlerta.find(t => t.valor === tipo);
    return tipoInfo?.label || tipo || 'Desconhecido';
  };

  const getStatusClass = (status: string) => {
    return status === 'ativo' ? 'status-ativo' : 'status-resolvido';
  };

  const getStatusText = (status: string) => {
    return status === 'ativo' ? 'Ativo' : 'Resolvido';
  };

  if (carregando && alertas.length === 0) {
    return (
      <div className="lista-container">
        <div className="loading">Carregando alertas...</div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <header className="lista-header">
        <h1>📋 Lista de Alertas</h1>
        <div className="header-actions">
          <Link to="/dashboard" className="btn-voltar">
            ← Voltar ao Dashboard
          </Link>
          <Link to="/criar-alerta" className="btn-criar">
            + Criar Alerta
          </Link>
        </div>
      </header>

      <div className="filtro-container">
        <label htmlFor="filtro-tipo">Filtrar por tipo:</label>
        <select 
          id="filtro-tipo" 
          value={filtro} 
          onChange={handleFiltroChange}
          className="filtro-select"
        >
          <option value="todos">Todos os tipos</option>
          {tiposAlerta.map(tipo => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.label}
            </option>
          ))}
        </select>

        {filtro !== "todos" && (
          <span className="filtro-info">
            Mostrando alertas do tipo: {tiposAlerta.find(t => t.valor === filtro)?.label}
          </span>
        )}
      </div>

      {erro && (
        <div className="erro-container">
          <p className="erro">{erro}</p>
          <button onClick={carregarAlertas} className="btn-tentar-novamente">
            Tentar novamente
          </button>
        </div>
      )}

      <div className="tabela-container">
        {alertas.length === 0 ? (
          <p className="sem-alertas">Nenhum alerta encontrado</p>
        ) : (
          <table className="alertas-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Local</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th> {/* Coluna de ações para TODOS os usuários */}
              </tr>
            </thead>
            <tbody>
              {alertas.map((alerta) => (
                <tr key={alerta.id} className={alerta.status === 'resolvido' ? 'resolvido' : ''}>
                  <td>
                    <span className={`tipo-badge tipo-${alerta.tipo}`}>
                      {getTipoLabel(alerta.tipo)}
                    </span>
                  </td>
                  <td className="descricao-cell" title={alerta.descricao}>
                    {alerta.descricao}
                  </td>
                  <td>{alerta.local}</td>
                  <td>{formatarData(alerta.data)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(alerta.status)}`}>
                      {getStatusText(alerta.status)}
                    </span>
                  </td>
                  <td>
                    {alerta.status === 'ativo' && (
                      <button
                        onClick={() => abrirModalResolver(alerta)}
                        disabled={atualizando}
                        className="btn-resolver"
                      >
                        ✓ Resolver
                      </button>
                    )}
                    {alerta.status === 'resolvido' && (
                      <span className="resolvido-label">Resolvido</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="resumo">
        <p>
          Total: <strong>{alertas.length}</strong> alerta(s) | 
          Ativos: <strong className="ativos-count">{alertas.filter(a => a.status === 'ativo').length}</strong> | 
          Resolvidos: <strong className="resolvidos-count">{alertas.filter(a => a.status === 'resolvido').length}</strong>
        </p>
      </div>

      {/* Modal para resolver alerta */}
      {alertaSelecionado && (
        <ModalResolver
          isOpen={modalAberto}
          onClose={fecharModal}
          onConfirm={handleResolver}
          alertaDescricao={alertaSelecionado.descricao}
          carregando={atualizando}
        />
      )}
    </div>
  );
}