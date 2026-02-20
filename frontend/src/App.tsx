import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CriarAlerta from "./pages/CriarAlerta";

function Dashboard() {
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema de alertas!</p>
      <a 
        href="/criar-alerta" 
        style={{ 
          display: "inline-block", 
          marginTop: "20px",
          padding: "10px 20px",
          background: "#2f80ed",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px"
        }}
      >
        Criar Novo Alerta
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/criar-alerta" element={<CriarAlerta />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;