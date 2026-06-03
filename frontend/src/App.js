import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CourtsPage from "./pages/CourtsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import AdminCourtsPage from "./pages/AdminCourtsPage";
import MyReviewsPage from "./pages/MyReviewsPage";
import ProfilePage from "./pages/ProfilePage";
import MyNotificationsPage from "./pages/MyNotificationsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <CourtsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <MyReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <MyNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourtsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminNotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
