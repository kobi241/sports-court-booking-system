import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {user && (
        <span className={styles.welcome}>Welcome, {user.first_name}</span>
      )}{" "}
      |{" "}
      {user && (
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
