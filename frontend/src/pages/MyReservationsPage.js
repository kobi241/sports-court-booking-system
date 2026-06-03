import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservations, deleteReservation } from "../services/api";

import ReservationCard from "../components/ReservationCard";
import styles from "./MyReservationsPage.module.css";

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      navigate("/admin/reservations");
    }
  }, [navigate]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getReservations();

    const sortedReservations = [...data].sort((a, b) => {
      const firstDateTime = `${a.reservation_date} ${a.reservation_time}`;
      const secondDateTime = `${b.reservation_date} ${b.reservation_time}`;

      return firstDateTime.localeCompare(secondDateTime);
    });

    setReservations(sortedReservations);
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    await deleteReservation(id);
    await loadReservations();
  };

  const filteredReservations =
    statusFilter === "all"
      ? reservations
      : reservations.filter(
          (reservation) => reservation.status === statusFilter,
        );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Reservations</h1>

      <div className={styles.filters}>
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`${styles.filterButton} ${
              statusFilter === status ? styles.activeFilter : ""
            }`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <p className={styles.emptyMessage}>
          You do not have any reservations yet.
        </p>
      ) : (
        <div className={styles.list}>
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              topContent={
                <>
                  <p className={styles.label}>Court</p>
                  <h2>{reservation.court_name}</h2>
                </>
              }
              extraContent={
                reservation.status === "rejected" &&
                reservation.rejection_reason && (
                  <div className={styles.rejectionBox}>
                    <p className={styles.label}>Rejection Reason</p>
                    <p>{reservation.rejection_reason}</p>
                  </div>
                )
              }
              actions={
                reservation.status === "pending" && (
                  <button
                    className={styles.button}
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    Cancel Reservation
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservationsPage;
