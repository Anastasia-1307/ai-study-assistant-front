
function Header({ onBack, onLogout }) {
  return (
    <header className="hero">
      <div className="header-actions">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Înapoi
          </button>
        )}
        {onLogout && (
          <button className="logout-button" onClick={onLogout}>
            Deconectare
          </button>
        )}
      </div>
      <p className="eyebrow">ASISTENT PERSONAL DE STUDIU</p>

      <h1>AI Study Assistant</h1>

      <p className="hero-description">
        Transformă cursurile tale în rezumate
        pentru a învăța mai ușor.
      </p>
    </header>
  );
}

export default Header;
