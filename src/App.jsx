import "./App.css";
import Header from "./components/Header";
import CourseForm from "./components/CourseForm";
import LoadingMessage from "./components/LoadingMessage";
import ResultPanel from "./components/ResultPanel";
import { useStudyAssistant } from "./hooks/useStudyAssistant";

function App() {
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
      <Header />

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

export default App;