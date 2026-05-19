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

    const result = await createReservation(newReservation);

    if (result.message !== "Reservation created") {
      alert(result.message || "Reservation could not be created");
      return;
    }

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

  const groupedFacilities = courts.reduce((groups, court) => {
    const facilityId = court.facility_id;

    if (!groups[facilityId]) {
      groups[facilityId] = {
        id: facilityId,
        name: court.facility_name,
        address: court.address,
        city: court.city,
        opening_hours: court.opening_hours,
        courts: [],
      };
    }

    groups[facilityId].courts.push(court);

    return groups;
  }, {});

  const facilities = Object.values(groupedFacilities);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sports Courts</h1>

      <div className={styles.facilitiesList}>
        {facilities.map((facility) => (
          <div key={facility.id} className={styles.facilityCard}>
            <div className={styles.facilityHeader}>
              <h2>{facility.name}</h2>
              <p>📍 {facility.address}</p>
              <p>🏙 {facility.city}</p>
              <p>🕒 {facility.opening_hours}</p>
            </div>

            <div className={styles.grid}>
              {facility.courts.map((court) => (
                <div key={court.id} className={styles.card}>
                  <span className={styles.badge}>{court.sport_type}</span>

                  <h3>{court.name}</h3>

                  <p>{court.indoor_outdoor}</p>
                  <p>Capacity: {court.capacity} players</p>
                  <p className={styles.price}>{court.hourly_price} €/hour</p>

                  <p>{court.description}</p>

                  <button
                    className={styles.button}
                    onClick={() => setSelectedCourt(court)}
                  >
                    Reserve Court
                  </button>
                </div>
              ))}
            </div>
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
