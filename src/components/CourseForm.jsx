import TextArea from "./TextArea";

function CourseForm({
  courseText,
  setCourseText,
  loading,
  error,
  onSubmit,
  onCancel,
  onPDFUploaded,
  uploadedDocument,
}) {
  function handleSubmit(event) {
    event.preventDefault();

    if (!loading) {
      onSubmit();
    }
  }

  return (
    <section className="panel">
      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="courseText">
          Întreabă orice
        </label>

        <TextArea
          value={courseText}
          onChange={setCourseText}
          onPDFUploaded={onPDFUploaded}
          uploadedDocument={uploadedDocument}
          loading={loading}
          onCancel={onCancel}
          disabled={!courseText.trim() || loading}
        />
      </form>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export default CourseForm;