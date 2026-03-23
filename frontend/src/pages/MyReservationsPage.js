import { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "../services/api";

import styles from "./MyReservationsPage.module.css";

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
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    await deleteReservation(id);
    await loadReservations();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Reservations</h1>

      {reservations.length === 0 ? (
        <p className={styles.emptyMessage}>
          You do not have any reservations yet.
        </p>
      ) : (
        <div className={styles.list}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={styles.card}>
              <p>Court: {reservation.court_name}</p>
              <p>User: {reservation.user_name}</p>
              <p>Date: {reservation.date}</p>
              <p>Time: {reservation.start_time}</p>

              <button
                className={styles.button}
                onClick={() => handleDeleteReservation(reservation.id)}
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservationsPage;
