
function Button({ loading, disabled }) {
  return (
    <button
      className="send-button"
      type="submit"
      disabled={loading || disabled}
      aria-label={loading ? "Se generează materialele" : "Generează materiale"}
      title={loading ? "Se generează..." : "Generează materiale"}
    >
      {loading ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      )}
    </button>
  );
}

export default Button;
