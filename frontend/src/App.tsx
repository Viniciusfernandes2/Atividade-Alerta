import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CriarAlerta from "./pages/CriarAlerta";
import ListaAlertas from "./pages/ListaAlertas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/criar-alerta" element={<CriarAlerta />} />
        <Route path="/lista-alertas" element={<ListaAlertas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;