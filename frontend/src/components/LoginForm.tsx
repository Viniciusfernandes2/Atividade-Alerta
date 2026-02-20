import { Link } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, senha });

      // salva token
      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Fique Alerta</h2>

      <input
  type="text"
  placeholder="Nome"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

<input
  type="password"
  placeholder="Senha"
  value={senha}
  onChange={(e) => setSenha(e.target.value)}
  required
/>

      {erro && <p className="erro">{erro}</p>}

      <button type="submit">Enviar</button>

      <p style={{ color: "white", fontSize: "14px" }}>
  Não possui conta? <Link to="/cadastro">Cadastrar</Link>
</p>

    </form>
  );
}