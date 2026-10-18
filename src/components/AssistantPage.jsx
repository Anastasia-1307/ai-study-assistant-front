import { useNavigate } from "react-router-dom";
import Header from "./Header";
import CourseForm from "./CourseForm";
import LoadingMessage from "./LoadingMessage";
import ResultPanel from "./ResultPanel";
import { useStudyAssistant } from "../hooks/useStudyAssistant";

function AssistantPage({ onLogout }) {
  const navigate = useNavigate();

  const {
    courseText,
    setCourseText,
    result,
    loading,
    error,
    generateMaterials,
    cancelGeneration,
    handlePDFUploaded,
    uploadedDocument,
  } = useStudyAssistant();

  return (
    <main className="app-shell">
      <Header onBack={() => navigate("/options")} onLogout={onLogout} />

      <CourseForm
        courseText={courseText}
        setCourseText={setCourseText}
        loading={loading}
        error={error}
        onSubmit={generateMaterials}
        onCancel={cancelGeneration}
        onPDFUploaded={handlePDFUploaded}
        uploadedDocument={uploadedDocument}
      />

      {loading && <LoadingMessage />}

      {result && <ResultPanel result={result} />}
    </main>
  );
}

export default AssistantPage;
