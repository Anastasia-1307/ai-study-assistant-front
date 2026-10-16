
function LoadingMessage() {
  return (
    <div className="loading-message" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>
        Modelul AI analizează cursul. Cererea poate fi procesată mai mult timp.
      </p>
    </div>
  );
}

export default LoadingMessage;
