import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/conversations";

export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_BASE, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Nu s-au putut încărca conversațiile");
      }
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title = "Conversație nouă") => {
      console.trace("Se creează o conversație nouă:", title);
      
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut crea conversația");
      }
      const newConversation = await response.json();
      setConversations([newConversation, ...conversations]);
      return newConversation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateConversation = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut actualiza conversația");
      }
      const updatedConversation = await response.json();
      setConversations(
        conversations.map((conv) =>
          conv.id === id ? updatedConversation : conv
        )
      );
      if (currentConversation?.id === id) {
        setCurrentConversation(updatedConversation);
      }
      return updatedConversation;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteConversation = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut șterge conversația");
      }
      setConversations(conversations.filter((conv) => conv.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const fetchConversationWithMessages = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut încărca conversația");
      }
      const data = await response.json();
      setCurrentConversation(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (conversationId, role, content) => {
    try {
      const response = await fetch(`${API_BASE}/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role, content }),
      });
      if (!response.ok) {
        throw new Error("Nu s-a putut adăuga mesajul");
      }
      const newMessage = await response.json();
      if (currentConversation?.id === conversationId) {
        setCurrentConversation({
          ...currentConversation,
          messages: [...(currentConversation.messages || []), newMessage],
        });
      }
      return newMessage;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    currentConversation,
    loading,
    error,
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    fetchConversationWithMessages,
    addMessage,
    setCurrentConversation,
  };
}
