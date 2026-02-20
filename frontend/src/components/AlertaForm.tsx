import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { criarAlerta } from "../services/alertaService";

export default function AlertaForm() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "informativo",
    local: "",
    data: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const tiposAlerta = [
    { valor: "informativo", label: "Informativo" },
    { valor: "urgente", label: "Urgente" },
    { valor: "critico", label: "Crítico" },
    { valor: "manutencao", label: "Manutenção" },
    { valor: "seguranca", label: "Segurança" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    // Validações
    if (!formData.titulo.trim()) {
      setErro("O título é obrigatório");
      setCarregando(false);
      return;
    }

    if (!formData.descricao.trim()) {
      setErro("A descrição é obrigatória");
      setCarregando(false);
      return;
    }

    if (!formData.local.trim()) {
      setErro("O local é obrigatório");
      setCarregando(false);
      return;
    }

    if (!formData.data) {
      setErro("A data é obrigatória");
      setCarregando(false);
      return;
    }

    try {
      // Adiciona o local e data à descrição ou cria campos separados
      // Como o backend atual só tem titulo, descricao e tipo,
      // vamos incluir local e data na descrição
      const descricaoCompleta = `${formData.descricao}\n\nLocal: ${formData.local}\nData: ${new Date(formData.data).toLocaleString('pt-BR')}`;
      
      const alertaData = {
        titulo: formData.titulo,
        descricao: descricaoCompleta,
        tipo: formData.tipo,
      };

      await criarAlerta(alertaData);
      
      setSucesso("Alerta cadastrado com sucesso!");
      
      // Limpa o formulário
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "informativo",
        local: "",
        data: "",
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      setErro("Erro ao cadastrar alerta. Tente novamente.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="alerta-form">
      <h2>Cadastrar Novo Alerta</h2>

      <div>
        <input
          type="text"
          name="titulo"
          placeholder="Título do Alerta *"
          value={formData.titulo}
          onChange={handleChange}
          disabled={carregando}
          required
        />
      </div>

      <div>
        <textarea
          name="descricao"
          placeholder="Descrição detalhada *"
          value={formData.descricao}
          onChange={handleChange}
          disabled={carregando}
          required
        />
      </div>

      <div>
        <select
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          disabled={carregando}
          required
        >
          {tiposAlerta.map(tipo => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          name="local"
          placeholder="Local do ocorrido *"
          value={formData.local}
          onChange={handleChange}
          disabled={carregando}
          required
        />
      </div>

      <div>
        <input
          type="datetime-local"
          name="data"
          value={formData.data}
          onChange={handleChange}
          disabled={carregando}
          required
        />
      </div>

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}

      <button type="submit" disabled={carregando}>
        {carregando ? "Cadastrando..." : "Cadastrar Alerta"}
      </button>

      <p className="campo-info">
        * Campos obrigatórios
      </p>

      <div className="nav-links">
        <Link to="/dashboard">Voltar ao Dashboard</Link>
        <Link to="/">Sair</Link>
      </div>
    </form>
  );
}