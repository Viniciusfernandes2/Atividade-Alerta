import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertaForm from "../components/AlertaForm";
import "./CriarAlerta.css";

export default function CriarAlerta() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="alerta-container">
      <div className="alerta-card">
        <AlertaForm />
      </div>
    </div>
  );
}