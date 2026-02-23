import { useState } from "react";
import "./ModalResolver.css";

interface ModalResolverProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  alertaDescricao: string;
  carregando?: boolean;
}

export default function ModalResolver({
  isOpen,
  onClose,
  onConfirm,
  alertaDescricao,
  carregando = false
}: ModalResolverProps) {
  const [motivo, setMotivo] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (motivo.trim()) {
      onConfirm(motivo);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Resolver Alerta</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="alerta-info">
              <strong>Alerta:</strong> {alertaDescricao.substring(0, 100)}...
            </div>

            <div className="form-group">
              <label htmlFor="motivo">
                Motivo da Resolução <span className="required">*</span>
              </label>
              <textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo pelo qual este alerta está sendo resolvido..."
                required
                rows={5}
                disabled={carregando}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-cancelar" 
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-confirmar"
              disabled={!motivo.trim() || carregando}
            >
              {carregando ? "Processando..." : "Confirmar Resolução"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}