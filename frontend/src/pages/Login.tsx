/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const navigate = useNavigate();

  const LogoIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, senha });
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch (err) {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">

          <div className="login-logo">
            <LogoIcon />
          </div>
          
          <h2>Bem Vindo ao Fique Alerta</h2>

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <div className="login-links">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
              />
              Lembrar-me
            </label>
            <Link to="/esqueci-senha" className="forgot-password">
              Esqueceu a senha?
            </Link>
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit">Entrar</button>

          <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>

          <p className="terms-text">
            Ao continuar, você concorda com nossos{" "}
            <Link to="/termos">Termos de Serviço</Link> e{" "}
            <Link to="/privacidade">Política de Privacidade</Link>
          </p>
        </form>
      </div>
    </div>
  );
}