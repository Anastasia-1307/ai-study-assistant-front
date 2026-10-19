import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function MaterialsPage() {
  const navigate = useNavigate();
  const { token, logout, refreshAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState(null);

  // Courses state
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    due_date: "",
    course_id: null
  });
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Schedule state
  const [schedule, setSchedule] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    subject: "",
    location: ""
  });
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Files state
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  const API_BASE = "http://localhost:8000/materials";

  const fetchWithAuth = async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // If token expired, try to refresh
    if (response.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        throw new Error("Sesiune expirată");
      }
    }

    if (!response.ok) {
      throw new Error("Eroare la încărcarea datelor");
    }
    return response.json();
  };

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "notes") loadNotes();
    if (activeTab === "courses") loadCourses();
    if (activeTab === "schedule") loadSchedule();
    if (activeTab === "files") loadFiles();
  }, [activeTab]);

  // Notes functions
  const loadNotes = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/notes`);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createNote = async (e) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return;

    try {
      await fetchWithAuth(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      setNewNote({ title: "", content: "" });
      loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNote = async (id) => {
    try {
      const resource = activeTab === "courses" ? "courses" : activeTab === "schedule" ? "schedule" : "notes";
      await fetchWithAuth(`${API_BASE}/${resource}/${id}`, { method: "DELETE" });
      if (resource === "courses") loadCourses();
      else if (resource === "schedule") loadSchedule();
      else loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateNote = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`${API_BASE}/notes/${editingNote.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: editingNote.title, content: editingNote.content }) });
      setEditingNote(null);
      loadNotes();
    } catch (err) { setError(err.message); }
  };

  // Courses functions
  const loadCourses = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/courses`);
      setCourses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name) return;

    try {
      await fetchWithAuth(`${API_BASE}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse),
      });
      setNewCourse({ name: "", description: "" });
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`${API_BASE}/courses/${editingCourse.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editingCourse.name, description: editingCourse.description }) });
      setEditingCourse(null);
      loadCourses();
    } catch (err) { setError(err.message); }
  };

  const deleteCourse = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/courses/${id}`, { method: "DELETE" });
      if (selectedCourse === id) setSelectedCourse(null);
      loadCourses();
    } catch (err) { setError(err.message); }
  };

  const loadAssignments = async (courseId) => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/assignments`);
      setAssignments(data.filter(a => a.course_id === courseId));
    } catch (err) {
      setError(err.message);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title) return;

    try {
      await fetchWithAuth(`${API_BASE}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAssignment,
          due_date: newAssignment.due_date || null,
          course_id: selectedCourse,
        }),
      });
      setNewAssignment({ title: "", description: "", due_date: "", course_id: null });
      loadAssignments(selectedCourse);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateAssignment = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`${API_BASE}/assignments/${editingAssignment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingAssignment.title,
          description: editingAssignment.description || null,
          due_date: editingAssignment.due_date || null,
          status: editingAssignment.status,
        }),
      });
      setEditingAssignment(null);
      loadAssignments(selectedCourse);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/assignments/${id}`, { method: "DELETE" });
      loadAssignments(selectedCourse);
    } catch (err) {
      setError(err.message);
    }
  };

  const setAssignmentStatus = async (assignment, status) => {
    try {
      await fetchWithAuth(`${API_BASE}/assignments/${assignment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadAssignments(selectedCourse);
    } catch (err) {
      setError(err.message);
    }
  };

  // Schedule functions
  const loadSchedule = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/schedule`);
      setSchedule(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.subject) return;

    try {
      await fetchWithAuth(`${API_BASE}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });
      setNewSchedule({
        day_of_week: "Monday",
        start_time: "09:00",
        end_time: "10:00",
        subject: "",
        location: ""
      });
      loadSchedule();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateSchedule = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth(`${API_BASE}/schedule/${editingSchedule.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day_of_week: editingSchedule.day_of_week, start_time: editingSchedule.start_time, end_time: editingSchedule.end_time, subject: editingSchedule.subject, location: editingSchedule.location }) });
      setEditingSchedule(null);
      loadSchedule();
    } catch (err) { setError(err.message); }
  };

  const deleteSchedule = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/schedule/${id}`, { method: "DELETE" });
      loadSchedule();
    } catch (err) { setError(err.message); }
  };

  // Files functions
  const loadFiles = async () => {
    try {
      const data = await fetchWithAuth(`${API_BASE}/files`);
      setFiles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await fetchWithAuth(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      setSelectedFile(null);
      loadFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteFile = async (id) => {
    try {
      await fetchWithAuth(`${API_BASE}/files/${id}`, { method: "DELETE" });
      loadFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await fetch(`${API_BASE}/files/${file.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Fișierul nu a putut fi descărcat");

      const downloadUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("filename", editingFile.filename);
    if (editingFile.replacement) formData.append("file", editingFile.replacement);
    try {
      await fetchWithAuth(`${API_BASE}/files/${editingFile.id}`, { method: "PATCH", body: formData });
      setEditingFile(null);
      loadFiles();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="materials-page">
      <div className="materials-header">
        <button className="back-button" onClick={() => navigate("/options")}>← Înapoi</button>
        <h1 className="materials-title">Materialele mele</h1>
        <button className="logout-button" onClick={logout}>Deconectare</button>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="materials-tabs">
        <button
          className={`tab-button ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notițe
        </button>
        <button
          className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          Cursuri
        </button>
        <button
          className={`tab-button ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => setActiveTab("schedule")}
        >
          Orar
        </button>
        <button
          className={`tab-button ${activeTab === "files" ? "active" : ""}`}
          onClick={() => setActiveTab("files")}
        >
          Fișiere
        </button>
      </div>

      <div className="materials-content">
        {activeTab === "notes" && (
          <div className="tab-content">
            <form className="material-form" onSubmit={createNote}>
              <input
                className="auth-input"
                placeholder="Titlu notiță"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <textarea
                className="course-textarea"
                placeholder="Conținut notiță..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
              <button type="submit" className="auth-button">Adaugă notiță</button>
            </form>
            <div className="items-list">
              {editingNote && <form className="material-form" onSubmit={updateNote}>
                <input className="auth-input" value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} />
                <textarea className="course-textarea" value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} />
                <button type="submit" className="auth-button">Salvează</button>
                <button type="button" className="view-button" onClick={() => setEditingNote(null)}>Anulează</button>
              </form>}
              {notes.map((note) => (
                <div key={note.id} className="item-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <button onClick={() => setEditingNote({ ...note })} className="view-button">Editează</button>
                  <button onClick={() => deleteNote(note.id)} className="delete-button">Șterge</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="tab-content">
            <form className="material-form" onSubmit={createCourse}>
              <input
                className="auth-input"
                placeholder="Nume curs"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
              <input
                className="auth-input"
                placeholder="Descriere (opțional)"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
              <button type="submit" className="auth-button">Adaugă curs</button>
            </form>
            <div className="items-list">
              {editingCourse && <form className="material-form" onSubmit={updateCourse}>
                <input className="auth-input" value={editingCourse.name} onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })} />
                <input className="auth-input" value={editingCourse.description || ""} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} />
                <button type="submit" className="auth-button">Salvează</button>
                <button type="button" className="view-button" onClick={() => setEditingCourse(null)}>Anulează</button>
              </form>}
              {courses.map((course) => (
                <div key={course.id} className="item-card">
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <button
                    onClick={() => {
                      setSelectedCourse(course.id);
                      loadAssignments(course.id);
                    }}
                    className="view-button"
                  >
                    Vezi teme
                  </button>
                  <button onClick={() => setEditingCourse({ ...course })} className="view-button">Editează</button>
                  <button onClick={() => deleteCourse(course.id)} className="delete-button">Șterge</button>
                </div>
              ))}
            </div>
            {selectedCourse && (
              <div className="assignments-section">
                <h3>Teme pentru cursul selectat</h3>
                <form className="material-form" onSubmit={createAssignment}>
                  <input
                    className="auth-input"
                    placeholder="Titlu temă"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                  <input
                    className="auth-input"
                    type="date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                  />
                  <textarea
                    className="course-textarea"
                    placeholder="Descriere (opțional)"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  />
                  <button type="submit" className="auth-button">Adaugă temă</button>
                </form>
                <div className="items-list">
                  {editingAssignment && (
                    <form className="material-form" onSubmit={updateAssignment}>
                      <input
                        className="auth-input"
                        value={editingAssignment.title}
                        onChange={(e) => setEditingAssignment({ ...editingAssignment, title: e.target.value })}
                      />
                      <input
                        className="auth-input"
                        type="date"
                        value={editingAssignment.due_date ? editingAssignment.due_date.split("T")[0] : ""}
                        onChange={(e) => setEditingAssignment({ ...editingAssignment, due_date: e.target.value })}
                      />
                      <textarea
                        className="course-textarea"
                        placeholder="Descriere (opțional)"
                        value={editingAssignment.description || ""}
                        onChange={(e) => setEditingAssignment({ ...editingAssignment, description: e.target.value })}
                      />
                      <button type="submit" className="auth-button">Salvează</button>
                      <button type="button" className="view-button" onClick={() => setEditingAssignment(null)}>Anulează</button>
                    </form>
                  )}
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="item-card">
                      <h4>{assignment.title}</h4>
                      {assignment.description && <p>{assignment.description}</p>}
                      <p>
                        Scadență:{" "}
                        {assignment.due_date
                          ? assignment.due_date.split("T")[0]
                          : "Nespecificată"}
                      </p>
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status === "completed" ? "Realizată" : "Nerealizată"}
                      </span>
                      <div className="assignment-actions">
                        <button onClick={() => setEditingAssignment({ ...assignment })} className="view-button">Editează</button>
                        <button
                          onClick={() => setAssignmentStatus(assignment, "completed")}
                          className="complete-button"
                          disabled={assignment.status === "completed"}
                        >
                          Realizată
                        </button>
                        <button
                          onClick={() => setAssignmentStatus(assignment, "pending")}
                          className="view-button"
                          disabled={assignment.status !== "completed"}
                        >
                          Nerealizată
                        </button>
                        <button onClick={() => deleteAssignment(assignment.id)} className="delete-button">Șterge</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="tab-content">
            <form className="material-form" onSubmit={createSchedule}>
              <select
                className="auth-input"
                value={newSchedule.day_of_week}
                onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: e.target.value })}
              >
                <option value="Monday">Luni</option>
                <option value="Tuesday">Marți</option>
                <option value="Wednesday">Miercuri</option>
                <option value="Thursday">Joi</option>
                <option value="Friday">Vineri</option>
                <option value="Saturday">Sâmbătă</option>
                <option value="Sunday">Duminică</option>
              </select>
              <input
                className="auth-input"
                type="time"
                value={newSchedule.start_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
              />
              <input
                className="auth-input"
                type="time"
                value={newSchedule.end_time}
                onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
              />
              <input
                className="auth-input"
                placeholder="Materie"
                value={newSchedule.subject}
                onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
              />
              <input
                className="auth-input"
                placeholder="Locație (opțional)"
                value={newSchedule.location}
                onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
              />
              <button type="submit" className="auth-button">Adaugă la orar</button>
            </form>
            <div className="items-list">
              {editingSchedule && <form className="material-form" onSubmit={updateSchedule}>
                <select className="auth-input" value={editingSchedule.day_of_week} onChange={(e) => setEditingSchedule({ ...editingSchedule, day_of_week: e.target.value })}>
                  <option value="Monday">Luni</option><option value="Tuesday">Marți</option><option value="Wednesday">Miercuri</option><option value="Thursday">Joi</option><option value="Friday">Vineri</option><option value="Saturday">Sâmbătă</option><option value="Sunday">Duminică</option>
                </select>
                <input className="auth-input" type="time" value={editingSchedule.start_time} onChange={(e) => setEditingSchedule({ ...editingSchedule, start_time: e.target.value })} />
                <input className="auth-input" type="time" value={editingSchedule.end_time} onChange={(e) => setEditingSchedule({ ...editingSchedule, end_time: e.target.value })} />
                <input className="auth-input" value={editingSchedule.subject} onChange={(e) => setEditingSchedule({ ...editingSchedule, subject: e.target.value })} />
                <input className="auth-input" value={editingSchedule.location || ""} onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.target.value })} />
                <button type="submit" className="auth-button">Salvează</button>
                <button type="button" className="view-button" onClick={() => setEditingSchedule(null)}>Anulează</button>
              </form>}
              {schedule.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.subject}</h3>
                  <p>{item.day_of_week}: {item.start_time} - {item.end_time}</p>
                  <p>{item.location}</p>
                  <button onClick={() => setEditingSchedule({ ...item })} className="view-button">Editează</button>
                  <button onClick={() => deleteSchedule(item.id)} className="delete-button">Șterge</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="tab-content">
            <form className="material-form" onSubmit={uploadFile}>
              <input
                type="file"
                className="auth-input file-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button type="submit" className="auth-button">Încarcă fișier</button>
            </form>
            <div className="items-list">
              {editingFile && <form className="material-form" onSubmit={updateFile}>
                <input className="auth-input" value={editingFile.filename} onChange={(e) => setEditingFile({ ...editingFile, filename: e.target.value })} />
                <input type="file" className="auth-input" onChange={(e) => setEditingFile({ ...editingFile, replacement: e.target.files[0] })} />
                <button type="submit" className="auth-button">Salvează</button>
                <button type="button" className="view-button" onClick={() => setEditingFile(null)}>Anulează</button>
              </form>}
              {files.map((file) => (
                <div key={file.id} className="item-card">
                  <h3>{file.filename}</h3>
                  <button onClick={() => downloadFile(file)} className="view-button">Descarcă</button>
                  <button onClick={() => setEditingFile({ ...file, replacement: null })} className="view-button">Editează</button>
                  <p>Tip: {file.file_type} | Mărime: {(file.file_size / 1024).toFixed(2)} KB</p>
                  <button onClick={() => deleteFile(file.id)} className="delete-button">Șterge</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialsPage;
