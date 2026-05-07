import { useEffect, useState } from "react";
import { getAdminReservations, updateReservationStatus } from "../services/api";

import styles from "./MyReservationsPage.module.css";

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getAdminReservations();
    setReservations(data);
  };

  const handleUpdateStatus = async (id, status) => {
    await updateReservationStatus(id, status);
    await loadReservations();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Reservations</h1>

      {reservations.length === 0 ? (
        <p className={styles.emptyMessage}>No reservations found.</p>
      ) : (
        <div className={styles.list}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={styles.card}>
              <p>Court: {reservation.court_name}</p>
              <p>User: {reservation.user_name}</p>
              <p>Date: {reservation.reservation_date?.split("T")[0]}</p>
              <p>Time: {reservation.reservation_time}</p>
              <p>Status: {reservation.status}</p>

              <button
                className={styles.button}
                onClick={() => handleUpdateStatus(reservation.id, "approved")}
              >
                Approve
              </button>

              <button
                className={styles.button}
                onClick={() => handleUpdateStatus(reservation.id, "rejected")}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReservationsPage;
