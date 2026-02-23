import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { register } from "../services/usuarioService";
import "./Login.css"; // Reutilizando o mesmo CSS

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!aceitoTermos) {
      setErro("Você precisa aceitar os Termos de Serviço");
      return;
    }

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
      
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setAceitoTermos(false);

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
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Criar nova conta</h2>

          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={carregando}
            required
          />

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={carregando}
            required
          />

          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={carregando}
            required
            minLength={6}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={carregando}
            required
          />

          <label className="remember-me">
            <input
              type="checkbox"
              checked={aceitoTermos}
              onChange={(e) => setAceitoTermos(e.target.checked)}
              disabled={carregando}
            />
            Eu aceito os <Link to="/termos">Termos de Serviço</Link> e{" "}
            <Link to="/privacidade">Política de Privacidade</Link>
          </label>

          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Criar conta"}
          </button>

          <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
            Já tem uma conta? <Link to="/">Fazer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}