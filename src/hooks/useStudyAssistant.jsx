import { useState, useRef, useEffect } from "react";

export function useStudyAssistant() {
  const [courseText, setCourseText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const handlePDFUploaded = (document) => {
  setUploadedDocument(document);
  setError("");
  setResult("");
};

  const controllerRef = useRef(null);

  
const generateMaterials = async () => {
  if (loading || !courseText.trim()) {
    return;
  }

  const controller = new AbortController();
  controllerRef.current = controller;

  setLoading(true);
  setError("");
  setResult("");

  try {
    const requestBody = {
      text: courseText.trim(),
    };

    // Adăugăm document_id numai dacă există un PDF încărcat.
    if (uploadedDocument?.document_id) {
      requestBody.document_id = uploadedDocument.document_id;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/generate-material",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Eroare /generate:", response.status, data);
      throw new Error(data.detail || "Generarea a eșuat.");
    }

    setResult(data.result || "");
  } catch (err) {
    if (err.name === "AbortError") {
      return;
    }

    setError(err.message || "A apărut o eroare neașteptată.");
  } finally {
    if (controllerRef.current === controller) {
      controllerRef.current = null;
      setLoading(false);
    }
  }
};

  const cancelGeneration = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return {
    courseText,
    setCourseText,
    result,
    loading,
    error,
    generateMaterials,
    cancelGeneration,
    uploadedDocument,
    setUploadedDocument,
    handlePDFUploaded,
  };
}