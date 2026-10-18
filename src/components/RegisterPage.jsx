import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    // 8-64 characters, at least one uppercase, one lowercase, one digit, one special character
    // Allowed special characters: # @ & * - _ $ % ! ?
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@&*\-_$%!?])[A-Za-z\d#@&*\-_$%!?]{8,64}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu coincid");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Parola trebuie să aibă între 8 și 64 caractere, și să includă cel puțin o majusculă, o minusculă, o cifră și un simbol special (#, @, &, *, -, _, $, %, !, ?)"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fname, lname, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Eroare la înregistrare");
      }

      // After successful registration, automatically login
      const loginResponse = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || "Eroare la autentificare");
      }

      login(loginData.access_token, loginData.refresh_token);
      navigate("/options");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Înregistrare</h1>
        <p className="auth-subtitle">Creează un cont nou</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="field-label">Nume</label>
            <input
              type="text"
              className="auth-input"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label">Prenume</label>
            <input
              type="text"
              className="auth-input"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="field-label">Parolă</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="auth-hint">
              Minim 8 caractere, majusculă, minusculă, cifră și simbol special (#, @, &, *, -, _, $, %, !, ?)
            </small>
          </div>

          <div className="form-group">
            <label className="field-label">Confirmă parola</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Se încarcă..." : "Înregistrare"}
          </button>
        </form>

        <p className="auth-switch">
          Ai deja cont?{" "}
          <button className="auth-link" onClick={() => navigate("/login")}>
            Autentifică-te
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
