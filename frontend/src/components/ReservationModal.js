import { createPortal } from "react-dom";
import { useEffect } from "react";
import styles from "./ReservationModal.module.css";

const generateTimeSlots = (openingHours) => {
  if (!openingHours) {
    return [];
  }

  const [start, end] = openingHours.split(" - ");

  const startHour = Number(start.slice(0, 2));
  const endHour = Number(end.slice(0, 2));

  const slots = [];

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStart = `${String(hour).padStart(2, "0")}:00:00`;
    const slotEnd = `${String(hour + 1).padStart(2, "0")}:00`;

    slots.push({
      value: slotStart,
      label: `${slotStart.slice(0, 5)} - ${slotEnd}`,
    });
  }

  return slots;
};

function ReservationModal({
  selectedCourt,
  reservationForm,
  setReservationForm,
  handleSubmitReservation,
  handleCloseModal,
}) {
  const timeSlots = generateTimeSlots(selectedCourt.opening_hours);

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

          <select
            className={styles.input}
            value={reservationForm.reservation_time}
            onChange={(e) =>
              setReservationForm({
                ...reservationForm,
                reservation_time: e.target.value,
              })
            }
          >
            <option value="">Select time slot</option>

            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>

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
