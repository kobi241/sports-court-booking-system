import styles from "./ReservationCard.module.css";

const formatTimeSlot = (time) => {
  const startHour = Number(time.slice(0, 2));
  const endHour = String(startHour + 1).padStart(2, "0");

  return `${time.slice(0, 5)} - ${endHour}:00`;
};

function ReservationCard({ reservation, topContent, actions, extraContent }) {
  const statusClass = styles[reservation.status];

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div>{topContent}</div>

        <span className={`${styles.status} ${statusClass}`}>
          {reservation.status}
        </span>
      </div>

      <div className={styles.facilityBox}>
        <p className={styles.label}>Facility</p>
        <h3>{reservation.facility_name}</h3>

        <p className={styles.label}>Address</p>
        <p>
          📍 {reservation.facility_address}, {reservation.facility_city}
        </p>
      </div>

      <div className={styles.infoGrid}>
        <div className={`${styles.infoBox} ${styles.fullWidth}`}>
          <p className={styles.label}>Court</p>
          <strong>{reservation.court_name}</strong>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.label}>Date</p>
          <strong>{reservation.reservation_date}</strong>
        </div>

        <div className={styles.infoBox}>
          <p className={styles.label}>Time Slot</p>
          <strong>{formatTimeSlot(reservation.reservation_time)}</strong>
        </div>
      </div>

      {extraContent}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

export default ReservationCard;
