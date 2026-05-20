import { useEffect, useState } from "react";
import { getAdminReservations, updateReservationStatus } from "../services/api";

import styles from "./AdminReservationsPage.module.css";

const formatTimeSlot = (time) => {
  const startHour = Number(time.slice(0, 2));
  const endHour = String(startHour + 1).padStart(2, "0");

  return `${time.slice(0, 5)} - ${endHour}:00`;
};

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    const data = await getAdminReservations();

    const sortedReservations = [...data].sort((a, b) => {
      const firstDateTime = `${a.reservation_date} ${a.reservation_time}`;
      const secondDateTime = `${b.reservation_date} ${b.reservation_time}`;

      return firstDateTime.localeCompare(secondDateTime);
    });

    setReservations(sortedReservations);
  };

  const handleUpdateStatus = async (id, status) => {
    await updateReservationStatus(id, status);
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
      <h1 className={styles.title}>Admin Reservations</h1>

      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${
            statusFilter === "all" ? styles.activeFilter : ""
          }`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          className={`${styles.filterButton} ${
            statusFilter === "pending" ? styles.activeFilter : ""
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          className={`${styles.filterButton} ${
            statusFilter === "approved" ? styles.activeFilter : ""
          }`}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </button>

        <button
          className={`${styles.filterButton} ${
            statusFilter === "rejected" ? styles.activeFilter : ""
          }`}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {filteredReservations.length === 0 ? (
        <p className={styles.emptyMessage}>No reservations found.</p>
      ) : (
        <div className={styles.list}>
          {filteredReservations.map((reservation) => {
            const statusClass = styles[reservation.status];

            return (
              <div key={reservation.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <p className={styles.label}>User</p>
                    <h2>{reservation.user_name}</h2>
                  </div>

                  <span className={`${styles.status} ${statusClass}`}>
                    {reservation.status}
                  </span>
                </div>

                <div className={styles.facilityBox}>
                  <p className={styles.label}>Facility</p>
                  <h3>{reservation.facility_name}</h3>

                  <p className={styles.label}>Address</p>
                  <p>
                    📍 {reservation.facility_address},{" "}
                    {reservation.facility_city}
                  </p>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoBox}>
                    <p className={styles.label}>Court</p>
                    <strong>{reservation.court_name}</strong>
                  </div>

                  <div className={styles.infoBox}>
                    <p className={styles.label}>Date</p>
                    <strong>{reservation.reservation_date}</strong>
                  </div>

                  <div className={styles.infoBox}>
                    <p className={styles.label}>Time Slot</p>
                    <strong>
                      {formatTimeSlot(reservation.reservation_time)}
                    </strong>
                  </div>
                </div>

                {reservation.status === "pending" && (
                  <div className={styles.actions}>
                    <button
                      className={`${styles.button} ${styles.approveButton}`}
                      onClick={() =>
                        handleUpdateStatus(reservation.id, "approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      className={`${styles.button} ${styles.rejectButton}`}
                      onClick={() =>
                        handleUpdateStatus(reservation.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminReservationsPage;
