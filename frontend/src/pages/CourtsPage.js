import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourts, createReservation } from "../services/api";

import ReservationModal from "../components/ReservationModal";
import styles from "./CourtsPage.module.css";

function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    reservation_date: "",
    reservation_time: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "admin") {
      navigate("/admin/reservations");
    }
  }, [navigate]);

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
      reservation_date: reservationForm.reservation_date,
      reservation_time: reservationForm.reservation_time,
      court_id: selectedCourt.id,
    };

    await createReservation(newReservation);

    handleCloseModal();

    alert("Reservation created successfully!");
  };

  const handleCloseModal = useCallback(() => {
    setSelectedCourt(null);
    setReservationForm({
      reservation_date: "",
      reservation_time: "",
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
            <p>Description: {court.description}</p>

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
