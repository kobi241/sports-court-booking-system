import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getNotifications } from "../services/api";

import styles from "./Navbar.module.css";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Could not read user from localStorage:", error);
    return null;
  }
};

function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) {
        return;
      }

      const data = await getNotifications();

      if (!Array.isArray(data)) {
        setUnreadCount(0);
        return;
      }

      const count = data.filter((notification) => !notification.is_read).length;
      setUnreadCount(count);
    };

    loadUnreadCount();

    window.addEventListener("notificationsUpdated", loadUnreadCount);

    return () => {
      window.removeEventListener("notificationsUpdated", loadUnreadCount);
    };
  }, [user]);

  const getLinkClass = (path) =>
    `${styles.link} ${location.pathname === path ? styles.activeLink : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const notificationText =
    unreadCount > 0 ? `Notifications 🔔 ${unreadCount}` : "Notifications";

  const adminNotificationText =
    unreadCount > 0
      ? `Admin Notifications 🔔 ${unreadCount}`
      : "Admin Notifications";

  return (
    <nav className={styles.navbar}>
      {user && (
        <span className={styles.welcome}>👋 Welcome, {user.first_name}</span>
      )}

      {user && !isAdmin && (
        <>
          <Link to="/" className={getLinkClass("/")}>
            Courts
          </Link>

          <Link to="/reservations" className={getLinkClass("/reservations")}>
            My Reservations
          </Link>

          <Link to="/my-reviews" className={getLinkClass("/my-reviews")}>
            My Reviews
          </Link>

          <Link to="/profile" className={getLinkClass("/profile")}>
            Profile
          </Link>

          <Link to="/notifications" className={getLinkClass("/notifications")}>
            {notificationText}
          </Link>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}

      {user && isAdmin && (
        <>
          <Link to="/admin/courts" className={getLinkClass("/admin/courts")}>
            Admin Courts
          </Link>

          <Link
            to="/admin/reservations"
            className={getLinkClass("/admin/reservations")}
          >
            Admin Reservations
          </Link>

          <Link
            to="/admin/notifications"
            className={getLinkClass("/admin/notifications")}
          >
            {adminNotificationText}
          </Link>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}

      {!user && (
        <>
          <Link to="/login" className={getLinkClass("/login")}>
            Login
          </Link>

          <Link to="/register" className={getLinkClass("/register")}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
