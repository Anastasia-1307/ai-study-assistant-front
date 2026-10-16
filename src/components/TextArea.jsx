
import { useEffect, useRef } from "react";
import Button from "./Button";
import UploadPDF from "./UploadPDF";

function TextArea({
  value,
  onChange,
  onCancel,
  maxLength = 15000,
  loading,
  disabled,
  onPDFUploaded,
}) {
  const textareaRef = useRef(null);

  // Numără cuvintele introduse
  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        300
      )}px`;
    }
  }, [value]);

  return (
    <div className="textarea-wrapper">
      <textarea
        ref={textareaRef}
        id="courseText"
        className="course-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Întreabă despre curs..."
        maxLength={maxLength}
        rows={3}
        required
        disabled={loading}
      />

      <div className="textarea-footer">
        <span className="character-count">
          {value.length} / {maxLength} caractere
          {" · "}
          {wordCount} cuvinte
        </span>

        <div className="textarea-actions">
          {loading ? (
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
              aria-label="Anulează generarea"
              title="Anulează generarea"
            >
             <span className="cancel-button-text">x</span>
            </button>
          ) : (
            <Button
  loading={false}
  disabled={disabled}
/>
          )}

          <UploadPDF onUploaded={onPDFUploaded} />
        </div>
      </div>
    </div>
  );
}

export default TextArea;
