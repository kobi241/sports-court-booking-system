import { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "../services/api";

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const handleDeleteReservation = async (id) => {
    await deleteReservation(id);
    await loadReservations();
  };

  return (
    <div>
      <h1>My Reservations</h1>

      {reservations.map((reservation) => (
        <div key={reservation.id}>
          <p>Court: {reservation.court_name}</p>
          <p>User: {reservation.user_name}</p>
          <p>Date: {reservation.date}</p>
          <p>Time: {reservation.start_time}</p>

          <button onClick={() => handleDeleteReservation(reservation.id)}>
            Cancel Reservation
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyReservationsPage;
