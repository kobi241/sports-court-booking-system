import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import CourtsPage from "./pages/CourtsPage";
import MyReservationsPage from "./pages/MyReservationsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">Courts</Link> |{" "}
          <Link to="/reservations">My Reservations</Link>
        </nav>

        <Routes>
          <Route path="/" element={<CourtsPage />} />
          <Route path="/reservations" element={<MyReservationsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
