import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      navigate("/login");
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

        
<div className="form-group">
  <label className="field-label">Parolă</label>

  <div className="password-input-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      className="auth-input"
      value={password}
      autoComplete="new-password"
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowPassword((prev) => !prev)}
      aria-label={showPassword ? "Ascunde parola" : "Afișează parola"}
      aria-pressed={showPassword}
    >
      {showPassword ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.5 0 2.8-.4 4-1.1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  </div>

  <small className="auth-hint">
    Minim 8 caractere, majusculă, minusculă, cifră și simbol special
    (#, @, &amp;, *, -, _, $, %, !, ?)
  </small>
</div>


     
<div className="form-group">
  <label className="field-label">Confirmă parola</label>

  <div className="password-input-wrapper">
    <input
      type={showConfirmPassword ? "text" : "password"}
      className="auth-input"
      value={confirmPassword}
      autoComplete="new-password"
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      aria-label={
        showConfirmPassword
          ? "Ascunde confirmarea parolei"
          : "Afișează confirmarea parolei"
      }
      aria-pressed={showConfirmPassword}
    >
      {showConfirmPassword ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.2-2.3 3.3M6.2 6.2C3.9 7.7 2.7 10 2.5 12c1 2.5 4.5 7 9.5 7 1.5 0 2.8-.4 4-1.1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  </div>
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
