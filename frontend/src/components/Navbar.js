import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

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
