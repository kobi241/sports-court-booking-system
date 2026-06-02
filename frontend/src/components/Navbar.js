import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNotifications } from "../services/api";

import styles from "./Navbar.module.css";

function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const notificationText =
    unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications";

  return (
    <nav className={styles.navbar}>
      {user && (
        <span className={styles.welcome}>Welcome, {user.first_name}</span>
      )}{" "}
      |{" "}
      {user && !isAdmin && (
        <>
          <Link to="/" className={styles.link}>
            Courts
          </Link>
          |{" "}
          <Link to="/reservations" className={styles.link}>
            My Reservations
          </Link>
          |{" "}
          <Link to="/my-reviews" className={styles.link}>
            My Reviews
          </Link>
          |{" "}
          <Link to="/profile" className={styles.link}>
            Profile
          </Link>
          |{" "}
          <Link to="/notifications" className={styles.link}>
            {notificationText}
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}
      {user && isAdmin && (
        <>
          <Link to="/admin/courts" className={styles.link}>
            Admin Courts
          </Link>
          |{" "}
          <Link to="/admin/reservations" className={styles.link}>
            Admin Reservations
          </Link>
          |{" "}
          <Link to="/admin/notifications" className={styles.link}>
            {unreadCount > 0
              ? `Admin Notifications (${unreadCount})`
              : "Admin Notifications"}
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </>
      )}
      {!user && (
        <>
          <Link to="/login" className={styles.link}>
            Login
          </Link>
          |{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
