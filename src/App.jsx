import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import SkillGap from "./pages/SkillGap";
import Roadmap from "./pages/Roadmap";
import MockInterview from "./pages/MockInterview";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <div className="min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-gap"
              element={
                <ProtectedRoute>
                  <SkillGap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <ProtectedRoute>
                  <MockInterview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;