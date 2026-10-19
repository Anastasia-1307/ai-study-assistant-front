import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProgressPage() {
  const navigate = useNavigate();
  const { token, logout, refreshAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Achievements (grades) state
  const [achievements, setAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState(null);
  const [newAchievement, setNewAchievement] = useState({
    subject: "",
    grade: "",
    date: "",
    notes: ""
  });

  // Study sessions state
  const [studySessions, setStudySessions] = useState([]);
  const [studyStats, setStudyStats] = useState(null);
  const [newSession, setNewSession] = useState({
    date: "",
    duration_minutes: "",
    subject: "",
    notes: ""
  });

  // Improvement areas state
  const [improvementAreas, setImprovementAreas] = useState([]);
  const [newArea, setNewArea] = useState({
    area: "",
    description: ""
  });

  const API_BASE = "http://localhost:8000/progress";

  const fetchWithAuth = async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        throw new Error("Sesiune expirată");
      }
    }

    if (!response.ok) {
      throw new Error("Eroare la încărcarea datelor");
    }
    return response.json();
  };

  useEffect(() => {
    loadAchievements();
    loadStudySessions();
    loadImprovementAreas();
  }, []);

  // Achievements functions
  const loadAchievements = async () => {
    try {
      const [data, stats] = await Promise.all([
        fetchWithAuth(`${API_BASE}/achievements`),
        fetchWithAuth(`${API_BASE}/achievements/stats`)
      ]);
      setAchievements(data);
      setAchievementStats(stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const createAchievement = async (e) => {
    e.preventDefault();
    if (!newAchievement.subject || !newAchievement.grade) return;

    try {
      await fetchWithAuth(`${API_BASE}/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAchievement,
          grade: parseInt(newAchievement.grade, 10)
        }),
      });
      setNewAchievement({ subject: "", grade: "", date: "", notes: "" });
      loadAchievements();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAchievement = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/achievements/${id}`, { method: "DELETE" });
      loadAchievements();
    } catch (err) {
      setError(err.message);
    }
  };

  // Study sessions functions
  const loadStudySessions = async () => {
    try {
      const [data, stats] = await Promise.all([
        fetchWithAuth(`${API_BASE}/study-sessions`),
        fetchWithAuth(`${API_BASE}/study-sessions/stats`)
      ]);
      setStudySessions(data);
      setStudyStats(stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const createStudySession = async (e) => {
    e.preventDefault();
    if (!newSession.duration_minutes) return;

    try {
      await fetchWithAuth(`${API_BASE}/study-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newSession,
          duration_minutes: parseInt(newSession.duration_minutes)
        }),
      });
      setNewSession({ date: "", duration_minutes: "", subject: "", notes: "" });
      loadStudySessions();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteStudySession = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/study-sessions/${id}`, { method: "DELETE" });
      loadStudySessions();
    } catch (err) {
      setError(err.message);
    }
  };

  // Improvement areas functions
  const loadImprovementAreas = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/improvement-areas`);
      setImprovementAreas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createImprovementArea = async (e) => {
    e.preventDefault();
    if (!newArea.area) return;

    try {
      await fetchWithAuth(`${API_BASE}/improvement-areas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArea),
      });
      setNewArea({ area: "", description: "" });
      loadImprovementAreas();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateImprovementArea = async (id, status) => {
    try {
      await fetchWithAuth(`${API_BASE}/improvement-areas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadImprovementAreas();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteImprovementArea = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/improvement-areas/${id}`, { method: "DELETE" });
      loadImprovementAreas();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <button className="back-button" onClick={() => navigate("/options")}>← Înapoi</button>
        <h1 className="progress-title">Progresul meu</h1>
        <button className="logout-button" onClick={logout}>Deconectare</button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {/* Stats Overview */}
      <div className="stats-grid">
        {achievementStats && (
          <div className="stat-card">
            <h3>Reușite</h3>
            <div className="stat-value">{achievementStats.total}</div>
            <div className="stat-label">Total note</div>
            <div className="stat-average">Medie: {achievementStats.average}</div>
          </div>
        )}
        {studyStats && (
          <div className="stat-card">
            <h3>Studiu</h3>
            <div className="stat-value">{studyStats.total_hours.toFixed(1)}h</div>
            <div className="stat-label">Total ore</div>
            <div className="stat-average">{studyStats.total_sessions} sesiuni</div>
          </div>
        )}
        {studyStats && (
          <div className="stat-card">
            <h3>Ultima săptămână</h3>
            <div className="stat-value">{studyStats.last_7_days_hours.toFixed(1)}h</div>
            <div className="stat-label">Ore studiate</div>
            <div className="stat-average">{studyStats.last_30_days_hours.toFixed(1)}h (30 zile)</div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="progress-section">
        <h2>Reușite (note)</h2>
        <form className="material-form" onSubmit={createAchievement}>
          <input
            className="auth-input"
            placeholder="Materie"
            value={newAchievement.subject}
            onChange={(e) => setNewAchievement({ ...newAchievement, subject: e.target.value })}
          />
          <input
            className="auth-input"
            type="number"
            min="1"
            max="10"
            step="1"
            placeholder="Notă (1-10)"
            value={newAchievement.grade}
            onChange={(e) => setNewAchievement({ ...newAchievement, grade: e.target.value })}
          />
          <input
            className="auth-input"
            type="date"
            value={newAchievement.date}
            onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
          />
          <button type="submit" className="auth-button">Adaugă notă</button>
        </form>
        <div className="items-list">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="item-card">
              <h3>{achievement.subject}</h3>
              <p>Notă: <strong>{achievement.grade}</strong></p>
              <p>Data: {new Date(achievement.date).toLocaleDateString('ro-RO')}</p>
              {achievement.notes && <p>{achievement.notes}</p>}
              <button onClick={() => deleteAchievement(achievement.id)} className="delete-button">Șterge</button>
            </div>
          ))}
        </div>
      </div>

      {/* Study Sessions Section */}
      <div className="progress-section">
        <h2>Sesiuni de studiu</h2>
        <form className="material-form" onSubmit={createStudySession}>
          <input
            className="auth-input"
            type="date"
            value={newSession.date}
            onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
          />
          <input
            className="auth-input"
            type="number"
            min="1"
            placeholder="Durată (minute)"
            value={newSession.duration_minutes}
            onChange={(e) => setNewSession({ ...newSession, duration_minutes: e.target.value })}
          />
          <input
            className="auth-input"
            placeholder="Materie (opțional)"
            value={newSession.subject}
            onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
          />
          <button type="submit" className="auth-button">Adaugă sesiune</button>
        </form>
        <div className="items-list">
          {studySessions.map((session) => (
            <div key={session.id} className="item-card">
              <h3>{session.subject || "Studiu general"}</h3>
              <p>Durată: <strong>{session.duration_minutes} minute</strong></p>
              <p>Data: {new Date(session.date).toLocaleDateString('ro-RO')}</p>
              {session.notes && <p>{session.notes}</p>}
              <button onClick={() => deleteStudySession(session.id)} className="delete-button">Șterge</button>
            </div>
          ))}
        </div>
      </div>

      {/* Improvement Areas Section */}
      <div className="progress-section">
        <h2>Aspecte de îmbunătățit</h2>
        <form className="material-form" onSubmit={createImprovementArea}>
          <input
            className="auth-input"
            placeholder="Aspect de îmbunătățit"
            value={newArea.area}
            onChange={(e) => setNewArea({ ...newArea, area: e.target.value })}
          />
          <input
            className="auth-input"
            placeholder="Descriere (opțional)"
            value={newArea.description}
            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
          />
          <button type="submit" className="auth-button">Adaugă aspect</button>
        </form>
        <div className="items-list">
          {improvementAreas.map((area) => (
            <div key={area.id} className="item-card">
              <h3>{area.area}</h3>
              <p>{area.description}</p>
              <span className={`status-badge ${area.status}`}>
                {area.status === "resolved" ? "Rezolvat" : area.status}
              </span>
              <div className="item-actions">
                {area.status === "active" && (
                  <button
                    onClick={() => updateImprovementArea(area.id, "resolved")}
                    className="view-button"
                  >
                    Marchează ca rezolvat
                  </button>
                )}
                <button onClick={() => deleteImprovementArea(area.id)} className="delete-button">Șterge</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
