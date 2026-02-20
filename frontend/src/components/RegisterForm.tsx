import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({ nome, email, senha });

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch {
      setErro("Erro ao cadastrar usuário");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Cadastro</h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
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

      <button type="submit">Cadastrar</button>

      <p style={{ color: "white", fontSize: "14px" }}>
        Já possui conta? <Link to="/">Entrar</Link>
      </p>
    </form>
  );
}