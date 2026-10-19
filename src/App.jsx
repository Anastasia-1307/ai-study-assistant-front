import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import OptionsPage from "./components/OptionsPage";
import AssistantPage from "./components/AssistantPage";
import MaterialsPage from "./components/MaterialsPage";
import ProgressPage from "./components/ProgressPage";

function AppRoutes() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage onLogin={login} onRegister={() => <Navigate to="/register" />} />} />
      <Route path="/register" element={<RegisterPage onRegister={login} onLogin={() => <Navigate to="/login" />} />} />

      {/* Protected routes */}
      <Route
        path="/options"
        element={
          <ProtectedRoute>
            <OptionsPage onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <AssistantPage onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/materials"
        element={
          <ProtectedRoute>
            <MaterialsPage onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-progress"
        element={
          <ProtectedRoute>
            <ProgressPage onLogout={logout} />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/options" : "/login"} replace />} />

      {/* Catch all - redirect to options if authenticated, otherwise login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/options" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
