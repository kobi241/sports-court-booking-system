import { createPortal } from "react-dom";
import { useEffect } from "react";
import styles from "./ReservationModal.module.css";

function ReservationModal({
  selectedCourt,
  reservationForm,
  setReservationForm,
  handleSubmitReservation,
  handleCloseModal,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseModal]);

  return createPortal(
    <div className={styles.overlay} onClick={handleCloseModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Reserve {selectedCourt.name}</h2>

        <form className={styles.form} onSubmit={handleSubmitReservation}>
          <input
            className={styles.input}
            type="date"
            value={reservationForm.reservation_date}
            onChange={(e) =>
              setReservationForm({
                ...reservationForm,
                reservation_date: e.target.value,
              })
            }
          />

          <input
            className={styles.input}
            type="time"
            value={reservationForm.reservation_time}
            onChange={(e) =>
              setReservationForm({
                ...reservationForm,
                reservation_time: e.target.value,
              })
            }
          />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCloseModal}
            >
              Close
            </button>

            <button
              className={styles.submitButton}
              type="submit"
              disabled={
                !reservationForm.reservation_date ||
                !reservationForm.reservation_time
              }
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default ReservationModal;
