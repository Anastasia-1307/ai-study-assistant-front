import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OptionsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="options-page">
      <div className="options-header">
        <h1 className="options-title">Bine ai venit!</h1>
        <button className="logout-button" onClick={logout}>
          Deconectare
        </button>
      </div>
      <p className="options-subtitle">Alege o opțiune pentru a continua</p>

      <div className="options-grid">
        <button className="option-card" onClick={() => navigate("/materials")}>

          <h2 className="card-title">Materialele mele</h2>
          <p className="card-description">Accesează și gestionează materialele tale de studiu</p>
        </button>

        <button className="option-card" onClick={() => navigate("/ai-assistant")}>

          <h2 className="card-title">Asistent AI</h2>
          <p className="card-description">Creează rezumate și învață mai ușor din cursurile tale</p>
        </button>

        <button className="option-card" onClick={() => navigate("/my-progress")}>

          <h2 className="card-title">Progresul meu</h2>
          <p className="card-description">Vezi statistici și progresul învățării tale</p>
        </button>
      </div>
    </div>
  );
}

export default OptionsPage;
