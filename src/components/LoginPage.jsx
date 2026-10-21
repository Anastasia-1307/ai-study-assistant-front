import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isBlockStateLoaded, setIsBlockStateLoaded] = useState(false);

  // Load blocked state from localStorage on mount
  useEffect(() => {
  const savedBlockedUntil = localStorage.getItem("loginBlockedUntil");

  if (savedBlockedUntil) {
    const blockedDate = new Date(savedBlockedUntil);

    if (blockedDate.getTime() > Date.now()) {
      setBlockedUntil(blockedDate);
      setTimeRemaining(
        Math.ceil((blockedDate.getTime() - Date.now()) / 1000)
      );
    } else {
      localStorage.removeItem("loginBlockedUntil");
    }
  }

  setIsBlockStateLoaded(true);
}, []);

useEffect(() => {
  if (!isBlockStateLoaded) return;

  if (blockedUntil) {
    localStorage.setItem(
      "loginBlockedUntil",
      blockedUntil.toISOString()
    );
  } else {
    localStorage.removeItem("loginBlockedUntil");
  }
}, [blockedUntil, isBlockStateLoaded]);

useEffect(() => {
  if (!blockedUntil) {
    setTimeRemaining(0);
    return;
  }

  const updateTimer = () => {
    const remaining = Math.max(
      0,
      Math.ceil(
        (new Date(blockedUntil).getTime() - Date.now()) / 1000
      )
    );

    setTimeRemaining(remaining);

    if (remaining <= 0) {
      setBlockedUntil(null);
      setError("");
      localStorage.removeItem("loginBlockedUntil");
    }
  };

  updateTimer();

  const interval = setInterval(updateTimer, 1000);

  return () => clearInterval(interval);
}, [blockedUntil]);

 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (timeRemaining > 0) return;

  setError("");
  setLoading(true);

  try {
    const result = await login(email, password);

    console.log("Răspuns login:", result);
    console.log("Status:", result?.status);
    console.log("Detail:", result?.detail);

    if (result?.success) {
      navigate("/options");
      return;
    }

    if (result?.status === 429) {
      const blockedUntilValue = result.detail?.blocked_until;

      console.log("blocked_until primit:", blockedUntilValue);

      if (blockedUntilValue) {
        const blockedDate = new Date(blockedUntilValue);
        const remaining = Math.ceil(
          (blockedDate.getTime() - Date.now()) / 1000
        );

        console.log("Data blocării:", blockedDate);
        console.log("Secunde rămase:", remaining);

        if (!Number.isNaN(blockedDate.getTime()) && remaining > 0) {
          setBlockedUntil(blockedDate);
          setTimeRemaining(remaining);
          setError("");
          return;
        }
      }

      setError(
        result.error ||
        "Autentificarea este temporar blocată, dar serverul nu a returnat o dată validă de deblocare."
      );
      return;
    }

    setError(result?.error || "Eroare la autentificare");
  } catch (err) {
    console.error("Eroare la login:", err);
    setError("A apărut o eroare. Încearcă din nou.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Autentificare</h1>
        <p className="auth-subtitle">Intră în contul tău</p>

{timeRemaining > 0 && (
  <div
    className="auth-error block-timer"
    role="status"
    aria-live="polite"
  >
    Contul este temporar blocat din cauza încercărilor eșuate.
    <br />
    Timp rămas până la deblocare:{" "}
    {Math.floor(timeRemaining / 60)}:
    {(timeRemaining % 60).toString().padStart(2, "0")}
  </div>
)}

{error && timeRemaining <= 0 && (
  <div className="auth-error" role="alert">
    {error}
  </div>
)}
        <form className="auth-form" onSubmit={handleSubmit}>
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
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || timeRemaining > 0}
          >
            {loading
              ? "Se încarcă..."
              : timeRemaining > 0
              ? `Blocat - ${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
              : "Autentificare"}
          </button>
        </form>

        <p className="auth-switch">
          Nu ai cont?{" "}
          <button className="auth-link" onClick={() => navigate("/register")}>
            Înregistrează-te
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
