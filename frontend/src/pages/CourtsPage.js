import { useEffect, useState } from "react";
import { getCourts, createReservation } from "../services/api";

function CourtsPage() {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    const data = await getCourts();
    setCourts(data);
  };

  const handleReserve = async (court) => {
    const reservation = {
      court_id: court.id,
      user_name: "Demo User",
    };

    await createReservation(reservation);

    await loadCourts();

    alert("Reservation created!");
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

          <button onClick={() => handleReserve(court)}>Reserve Court</button>
        </div>
      ))}
    </div>
  );
}

export default CourtsPage;
