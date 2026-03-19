import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav>
      {user && (
        <>
          <Link to="/">Courts</Link> |{" "}
          <Link to="/reservations">My Reservations</Link> |{" "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      {!user && (
        <>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
