import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { register } from "../services/usuarioService";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Validações
    if (!nome.trim()) {
      setErro("Nome é obrigatório");
      return;
    }

    if (!email.trim()) {
      setErro("Email é obrigatório");
      return;
    }

    if (!senha) {
      setErro("Senha é obrigatória");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true);

    try {
      const response = await register({ nome, email, senha });
      
      setSucesso(`Cadastro realizado com sucesso! Bem-vindo, ${response.nome}!`);
      
      // Limpa o formulário
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: unknown) {
      const error = err as AxiosError<{ erro?: string }>;
      if (error.response?.status === 409) {
        setErro("Email já cadastrado");
      } else if (error.response?.data?.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro("Erro ao cadastrar usuário. Tente novamente.");
      }
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Cadastro</h2>

      <input
        type="text"
        placeholder="Nome completo *"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        disabled={carregando}
        required
      />

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={carregando}
        required
      />

      <input
        type="password"
        placeholder="Senha * (mínimo 6 caracteres)"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        disabled={carregando}
        required
        minLength={6}
      />

      <input
        type="password"
        placeholder="Confirmar senha *"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        disabled={carregando}
        required
      />

      {erro && <p className="erro">{erro}</p>}
      {sucesso && <p className="sucesso">{sucesso}</p>}

      <button type="submit" disabled={carregando}>
        {carregando ? "Cadastrando..." : "Cadastrar"}
      </button>

      <p style={{ color: "white", fontSize: "14px" }}>
        Já possui conta? <Link to="/">Entrar</Link>
      </p>
      
      <p style={{ color: "#888", fontSize: "12px", marginTop: "10px" }}>
        * Campos obrigatórios
      </p>
    </form>
  );
}