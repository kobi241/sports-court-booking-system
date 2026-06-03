import { useEffect, useState } from "react";
import {
  getAdminReservations,
  updateReservationStatus,
  getUserProfileById,
} from "../services/api";

import ReservationCard from "../components/ReservationCard";
import UserProfileModal from "../components/UserProfileModal";
import styles from "./AdminReservationsPage.module.css";

function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

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
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason = window.prompt("Please enter rejection reason:");

      if (!rejectionReason) {
        alert("Rejection reason is required.");
        return;
      }
    }

    await updateReservationStatus(id, {
      status,
      rejection_reason: rejectionReason,
    });

    await loadReservations();
  };

  const handleOpenUserProfile = async (userId) => {
    const data = await getUserProfileById(userId);
    setSelectedUserProfile(data);
  };

  const handleCloseUserProfile = () => {
    setSelectedUserProfile(null);
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
        <p className={styles.emptyMessage}>No reservations found.</p>
      ) : (
        <div className={styles.list}>
          {filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              topContent={
                <>
                  <p className={styles.label}>User</p>
                  <h2>{reservation.user_name}</h2>

                  <button
                    type="button"
                    className={styles.profileButton}
                    onClick={() => handleOpenUserProfile(reservation.user_id)}
                  >
                    View Profile
                  </button>
                </>
              }
              actions={
                reservation.status === "pending" && (
                  <>
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
                  </>
                )
              }
            />
          ))}
        </div>
      )}

      {selectedUserProfile && (
        <UserProfileModal
          userProfile={selectedUserProfile}
          handleCloseUserProfile={handleCloseUserProfile}
        />
      )}
    </div>
  );
}

export default AdminReservationsPage;
