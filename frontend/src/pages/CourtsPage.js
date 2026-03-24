import { useCallback, useEffect, useState } from "react";
import { getCourts, createReservation } from "../services/api";

import ReservationModal from "../components/ReservationModal";
import styles from "./CourtsPage.module.css";

function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    user_name: "",
    date: "",
    start_time: "",
  });

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    const data = await getCourts();
    setCourts(data);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    const newReservation = {
      court_id: selectedCourt.id,
      court_name: selectedCourt.name,
      user_name: reservationForm.user_name,
      date: reservationForm.date,
      start_time: reservationForm.start_time,
    };

    await createReservation(newReservation);

    handleCloseModal();

    alert("Reservation created successfully!");
  };

  const handleCloseModal = useCallback(() => {
    setSelectedCourt(null);
    setReservationForm({
      user_name: "",
      date: "",
      start_time: "",
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sports Courts</h1>

      <div className={styles.grid}>
        {courts.map((court) => (
          <div key={court.id} className={styles.card}>
            <h3>{court.name}</h3>
            <p>Location: {court.location}</p>
            <p>Sport: {court.sport_type}</p>
            <p>Price: {court.price_per_hour} €/hour</p>

            <button
              className={styles.button}
              onClick={() => setSelectedCourt(court)}
            >
              Reserve Court
            </button>
          </div>
        ))}
      </div>
      {selectedCourt && (
        <ReservationModal
          selectedCourt={selectedCourt}
          reservationForm={reservationForm}
          setReservationForm={setReservationForm}
          handleSubmitReservation={handleSubmitReservation}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}

export default CourtsPage;
