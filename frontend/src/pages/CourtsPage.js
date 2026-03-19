import { useEffect, useState } from "react";
import { getCourts, createReservation } from "../services/api";

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

    setReservationForm({
      user_name: "",
      date: "",
      start_time: "",
    });

    setSelectedCourt(null);

    alert("Reservation created successfully!");
  };

  return (
    <div>
      <h1>Sports Courts</h1>

      {courts.map((court) => (
        <div key={court.id}>
          <h3>{court.name}</h3>
          <p>Location: {court.location}</p>
          <p>Sport: {court.sport_type}</p>
          <p>Price: {court.price_per_hour} €/hour</p>

          <button onClick={() => setSelectedCourt(court)}>Reserve Court</button>
        </div>
      ))}
      {selectedCourt && (
        <div>
          <h2>Reserve {selectedCourt.name}</h2>

          <form onSubmit={handleSubmitReservation}>
            <input
              type="text"
              placeholder="Your name"
              value={reservationForm.user_name}
              onChange={(e) =>
                setReservationForm({
                  ...reservationForm,
                  user_name: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={reservationForm.date}
              onChange={(e) =>
                setReservationForm({
                  ...reservationForm,
                  date: e.target.value,
                })
              }
            />

            <input
              type="time"
              value={reservationForm.start_time}
              onChange={(e) =>
                setReservationForm({
                  ...reservationForm,
                  start_time: e.target.value,
                })
              }
            />

            <button type="submit">Confirm Reservation</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CourtsPage;
