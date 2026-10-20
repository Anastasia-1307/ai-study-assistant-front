import { useRef, useState } from "react";

export default function UploadPDF({ onUploaded }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setMessage("");
    setFile(null);

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setMessage("Selectează un fișier PDF.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage("Fișierul nu poate depăși 10 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/upload-pdf",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Încărcarea a eșuat.");
      }

      setMessage("");


onUploaded?.({
  filename: data.filename || selectedFile.name,
  pages: data.pages,
  document_id: data.document_id,
  chunks_saved: data.chunks_saved,
});
    } catch (error) {
      setFile(null);
      setMessage(
        error.message || "Nu s-a putut conecta la server."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  function handleRemoveFile() {
    setFile(null);
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onUploaded?.(null);
  }

  return (
    <div className="upload-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        hidden
      />

      <button
        type="button"
        className="attachment-button"
        title="Atașează un PDF"
        aria-label="Atașează un PDF"
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <span className="upload-spinner" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48" />
          </svg>
        )}
      </button>

      {file && (
  <div className="selected-pdf">
    <span className="upload-filename" title={file.name}>
      {file.name}
    </span>

    <button
      type="button"
      className="remove-file-button"
      style={{
        background: "transparent",
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
      }}
      title="Elimină PDF-ul"
      aria-label="Elimină PDF-ul"
      disabled={loading}
      onClick={handleRemoveFile}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
)}

      {message && (
        <span className="upload-message" role="status">
          {message}
        </span>
      )}
    </div>
  );
}
