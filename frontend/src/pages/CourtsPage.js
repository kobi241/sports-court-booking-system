import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourts, createReservation, getCourtReviews } from "../services/api";
import ReservationModal from "../components/ReservationModal";
import ReviewModal from "../components/ReviewModal";

import styles from "./CourtsPage.module.css";

function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedReviewsCourt, setSelectedReviewsCourt] = useState(null);
  const [courtReviews, setCourtReviews] = useState(null);

  const [reservationForm, setReservationForm] = useState({
    reservation_date: "",
    reservation_time: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    if (user?.role === "admin") {
      navigate("/admin/reservations");
    }
  }, [navigate]);

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      const data = await getCourts();
      setCourts(data);
    } catch (error) {
      console.error("Failed to load courts:", error);
      alert("Failed to load courts.");
    }
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    const newReservation = {
      reservation_date: reservationForm.reservation_date,
      reservation_time: reservationForm.reservation_time,
      court_id: selectedCourt.id,
    };

    try {
      const result = await createReservation(newReservation);

      if (result.message !== "Reservation created") {
        alert(result.message || "Reservation could not be created");
        return;
      }

      handleCloseModal();

      alert("Reservation created successfully!");
    } catch (error) {
      console.error("Failed to create reservation:", error);
      alert("Failed to create reservation.");
    }
  };

  const handleCloseModal = useCallback(() => {
    setSelectedCourt(null);
    setReservationForm({
      reservation_date: "",
      reservation_time: "",
    });
  }, []);

  const handleOpenReviews = async (court) => {
    setSelectedReviewsCourt(court);

    try {
      const data = await getCourtReviews(court.id);
      setCourtReviews(data);
    } catch (error) {
      console.error("Failed to load court reviews:", error);
      alert("Failed to load court reviews.");
      setCourtReviews({ reviews: [], averageRating: 0, reviewCount: 0 });
    }
  };

  const handleCloseReviews = () => {
    setSelectedReviewsCourt(null);
    setCourtReviews(null);
  };

  const filteredCourts = courts.filter((court) => {
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);

    const searchableText = `
    ${court.city}
    ${court.sport_type}
  `.toLowerCase();

    const matchesSearch =
      searchTerm.trim() === "" ||
      searchWords.every((word) => searchableText.includes(word));

    const matchesType =
      typeFilter === "all" || court.indoor_outdoor === typeFilter;

    return matchesSearch && matchesType;
  });

  const groupedFacilities = filteredCourts.reduce((groups, court) => {
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

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by city or sport..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All types</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {facilities.length === 0 ? (
        <p className={styles.emptyMessage}>No courts match your search.</p>
      ) : (
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

                    <div className={styles.reviewSummary}>
                      {court.review_count > 0 ? (
                        <>
                          <span>⭐ {court.average_rating}/5</span>
                          <span>{court.review_count} reviews</span>
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => handleOpenReviews(court)}
                          >
                            View Reviews
                          </button>
                        </>
                      ) : (
                        <span>No reviews yet</span>
                      )}
                    </div>

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
      )}

      {selectedCourt && (
        <ReservationModal
          selectedCourt={selectedCourt}
          reservationForm={reservationForm}
          setReservationForm={setReservationForm}
          handleSubmitReservation={handleSubmitReservation}
          handleCloseModal={handleCloseModal}
        />
      )}

      {selectedReviewsCourt && (
        <ReviewModal
          selectedReviewsCourt={selectedReviewsCourt}
          courtReviews={courtReviews}
          handleCloseReviews={handleCloseReviews}
        />
      )}
    </div>
  );
}

export default CourtsPage;
