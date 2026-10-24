import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import CourseForm from "./CourseForm";
import LoadingMessage from "./LoadingMessage";
import ResultPanel from "./ResultPanel";
import { useStudyAssistant } from "../hooks/useStudyAssistant";
import { useConversations } from "../hooks/useConversations";

function AssistantPage({ onLogout }) {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const {
    courseText,
    setCourseText,
    result,
    setResult,
    loading,
    error,
    generateMaterials,
    cancelGeneration,
    handlePDFUploaded,
    uploadedDocument,
  } = useStudyAssistant();

  const {
    conversations,
    currentConversation,
    loading: convLoading,
    createConversation,
    updateConversation,
    deleteConversation,
    fetchConversationWithMessages,
    addMessage,
    setCurrentConversation,
  } = useConversations();

  const handleNewConversation = async () => {
    const newConv = await createConversation();
    setCurrentConversation(newConv);
    setCourseText("");
    setResult("");
  };


const handleGenerateWithConversation = async () => {
  const userMessage = courseText.trim();
  if (!userMessage) return;

  let conversation = currentConversation;

  if (!conversation) {
    conversation = await createConversation();
    setCurrentConversation(conversation);
  }

  await generateMaterials(conversation.id);

  await fetchConversationWithMessages(conversation.id);
};


const handleSelectConversation = async (conv) => {
  setResult("");
  setCourseText("");

  await fetchConversationWithMessages(conv.id);
};

  const handleTogglePin = async (conv) => {
    await updateConversation(conv.id, { is_pinned: !conv.is_pinned });
  };

  const handleStartEditTitle = (conv) => {
    setEditingTitle(conv.id);
    setNewTitle(conv.title);
  };

  const handleSaveTitle = async (conv) => {
    if (newTitle.trim()) {
      await updateConversation(conv.id, { title: newTitle.trim() });
    }
    setEditingTitle(null);
    setNewTitle("");
  };

  const handleCancelEditTitle = () => {
    setEditingTitle(null);
    setNewTitle("");
  };

  const handleDeleteConversation = async (convId) => {
    if (window.confirm("Ești sigur că vrei să ștergi această conversație?")) {
      await deleteConversation(convId);
    }
  };



  return (
    <main className="app-shell">
      <Header onBack={() => navigate("/options")} onLogout={onLogout} />

      <div className={`assistant-layout${showSidebar ? "" : " assistant-layout--history-hidden"}`}>
        {showSidebar && (
          <aside className="conversation-history" aria-label="Istoric conversații">
            <button
              onClick={handleNewConversation}
              className="new-conversation-button"
            >
              + Conversație nouă
            </button>

 {convLoading && conversations.length === 0 && (
  <p style={{ color: "#6b7280", fontSize: "14px" }}>
    Încărcare...
  </p>
)}

<div>
  {conversations.map((conv) => (
    <div
      key={conv.id}
      style={{
        marginBottom: "6px",
        padding: "8px",
        backgroundColor:
          currentConversation?.id === conv.id
            ? "#dbeafe"
            : "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={() => handleSelectConversation(conv)}
    >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {editingTitle === conv.id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onBlur={() => handleSaveTitle(conv)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle(conv);
                            if (e.key === "Escape") handleCancelEditTitle();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: "4px",
                            fontSize: "14px",
                            marginRight: "8px",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            flex: 1,
                            fontSize: "14px",
                            fontWeight: conv.is_pinned ? "600" : "normal",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {conv.is_pinned && "📌 "}
                          {conv.title}
                        </span>
                      )}

                      <div
                        style={{ display: "flex", gap: "4px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingTitle !== conv.id && (
                          <>
                            <button
                              onClick={() => handleTogglePin(conv)}
                              style={{
                                padding: "4px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              title={conv.is_pinned ? "Depinează" : "Fixează"}
                            >
                              {conv.is_pinned ? "📌" : "📍"}
                            </button>
                            <button
                              onClick={() => handleStartEditTitle(conv)}
                              style={{
                                padding: "4px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              title="Editează titlul"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteConversation(conv.id)}
                              style={{
                                padding: "4px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              title="Șterge"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                      </div>
                    </div>
              </div>
))}
</div>
</aside>
        )}

        <section className="assistant-chat">
  <button
    onClick={() => setShowSidebar(!showSidebar)}
    className="history-toggle-button"
  >
    {showSidebar ? "◀ Ascunde sidebar" : "▶ Arată sidebar"}
  </button>

  {currentConversation && (
    <div className="conversation-messages">
      {(currentConversation.messages || []).map((message) => (
        <div
          key={message.id}
          className={`message ${
            message.role === "user"
              ? "message-user"
              : "message-assistant"
          }`}
        >
          <strong>
            {message.role === "user" ? "Tu" : "Asistent"}
          </strong>

          <div className="message-content">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )}

  {!currentConversation && result && (
    <div className="conversation-messages">
      <ResultPanel result={result} />
    </div>
  )}

  {loading && <LoadingMessage />}

  <div className="chat-prompt-container">
    <CourseForm
      courseText={courseText}
      setCourseText={setCourseText}
      loading={loading}
      error={error}
      onSubmit={handleGenerateWithConversation}
      onCancel={cancelGeneration}
      onPDFUploaded={handlePDFUploaded}
      uploadedDocument={uploadedDocument}
    />
  </div>
</section>
      </div>
    </main>
  );
}

export default AssistantPage;
