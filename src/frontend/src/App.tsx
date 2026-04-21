import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/layouts/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED ROUTES (Wrapped by Gatekeeper) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* <Route path="/classrooms" element={<Classrooms />} /> */}

          {/* Add more protected routes here later */}
        </Route>

        {/* CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
