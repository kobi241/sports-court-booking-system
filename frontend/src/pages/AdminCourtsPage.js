import { useEffect, useState } from "react";
import {
  getCourts,
  getFacilities,
  createFacility,
  createCourt,
  deleteCourt,
  deleteFacility,
} from "../services/api";

import styles from "./MyReservationsPage.module.css";

const emptyFacilityForm = {
  name: "",
  address: "",
  city: "",
  contact_email: "",
  phone_number: "",
  opening_hours: "",
};

const emptyCourtForm = {
  name: "",
  description: "",
  sport_type: "",
  indoor_outdoor: "indoor",
  capacity: "",
  hourly_price: "",
};

function AdminCourtsPage() {
  const [facilities, setFacilities] = useState([]);
  const [courts, setCourts] = useState([]);

  const [newFacility, setNewFacility] = useState(emptyFacilityForm);
  const [newCourt, setNewCourt] = useState(emptyCourtForm);

  const [activeCourtFormFacilityId, setActiveCourtFormFacilityId] =
    useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const facilitiesData = await getFacilities();
    const courtsData = await getCourts();

    setFacilities(facilitiesData);
    setCourts(courtsData);
  };

  const handleFacilityChange = (e) => {
    setNewFacility({
      ...newFacility,
      [e.target.name]: e.target.value,
    });
  };

  const handleCourtChange = (e) => {
    setNewCourt({
      ...newCourt,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateFacility = async (e) => {
    e.preventDefault();

    const result = await createFacility(newFacility);

    if (result.message !== "Facility created successfully") {
      alert(result.message || "Facility could not be created");
      return;
    }

    setNewFacility(emptyFacilityForm);

    await loadData();

    alert("Facility created successfully!");
  };

  const handleDeleteFacility = async (facilityId) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) {
      return;
    }

    const result = await deleteFacility(facilityId);

    if (result.message !== "Facility deleted successfully") {
      alert(result.message || "Facility could not be deleted");
      return;
    }

    await loadData();

    alert("Facility deleted successfully!");
  };

  const handleCreateCourt = async (e, facilityId) => {
    e.preventDefault();

    const courtData = {
      ...newCourt,
      facility_id: facilityId,
    };

    const result = await createCourt(courtData);

    if (result.message !== "Court created successfully") {
      alert(result.message || "Court could not be created");
      return;
    }

    setNewCourt(emptyCourtForm);
    setActiveCourtFormFacilityId(null);

    await loadData();

    alert("Court created successfully!");
  };

  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm("Are you sure you want to delete this court?")) {
      return;
    }

    const result = await deleteCourt(courtId);

    if (result.message !== "Court deleted successfully") {
      alert(result.message || "Court could not be deleted");
      return;
    }

    await loadData();

    alert("Court deleted successfully!");
  };

  const handleOpenCourtForm = (facilityId) => {
    setActiveCourtFormFacilityId(facilityId);
    setNewCourt(emptyCourtForm);
  };

  const handleCloseCourtForm = () => {
    setActiveCourtFormFacilityId(null);
    setNewCourt(emptyCourtForm);
  };

  const getCourtsForFacility = (facilityId) => {
    return courts.filter((court) => court.facility_id === facilityId);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Courts</h1>

      <form className={styles.card} onSubmit={handleCreateFacility}>
        <h2>Add Facility</h2>

        <input
          type="text"
          name="name"
          placeholder="Facility Name"
          value={newFacility.name}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newFacility.address}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={newFacility.city}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <input
          type="email"
          name="contact_email"
          placeholder="Contact Email"
          value={newFacility.contact_email}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={newFacility.phone_number}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <input
          type="text"
          name="opening_hours"
          placeholder="Opening Hours"
          value={newFacility.opening_hours}
          onChange={handleFacilityChange}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Add Facility
        </button>
      </form>

      {facilities.length === 0 ? (
        <p className={styles.emptyMessage}>No facilities found.</p>
      ) : (
        <div className={styles.list}>
          {facilities.map((facility) => (
            <div key={facility.id} className={styles.card}>
              <h2>{facility.name}</h2>
              <p>Address: {facility.address}</p>
              <p>City: {facility.city}</p>
              <p>Contact Email: {facility.contact_email}</p>
              <p>Phone: {facility.phone_number}</p>
              <p>Opening Hours: {facility.opening_hours}</p>

              <button
                type="button"
                className={styles.button}
                onClick={() => handleDeleteFacility(facility.id)}
              >
                Delete Facility
              </button>

              <button
                type="button"
                className={styles.button}
                onClick={() => handleOpenCourtForm(facility.id)}
              >
                Add Court
              </button>

              {activeCourtFormFacilityId === facility.id && (
                <form onSubmit={(e) => handleCreateCourt(e, facility.id)}>
                  <h3>Add Court</h3>

                  <input
                    type="text"
                    name="name"
                    placeholder="Court Name"
                    value={newCourt.name}
                    onChange={handleCourtChange}
                    className={styles.input}
                  />

                  <input
                    type="text"
                    name="sport_type"
                    placeholder="Sport Type"
                    value={newCourt.sport_type}
                    onChange={handleCourtChange}
                    className={styles.input}
                  />

                  <select
                    name="indoor_outdoor"
                    value={newCourt.indoor_outdoor}
                    onChange={handleCourtChange}
                    className={styles.input}
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>

                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={newCourt.capacity}
                    onChange={handleCourtChange}
                    className={styles.input}
                  />

                  <input
                    type="number"
                    name="hourly_price"
                    placeholder="Hourly Price"
                    value={newCourt.hourly_price}
                    onChange={handleCourtChange}
                    className={styles.input}
                  />

                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newCourt.description}
                    onChange={handleCourtChange}
                    className={styles.input}
                  />

                  <button type="submit" className={styles.button}>
                    Save Court
                  </button>

                  <button
                    type="button"
                    className={styles.button}
                    onClick={handleCloseCourtForm}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <h3>Courts</h3>

              {getCourtsForFacility(facility.id).length === 0 ? (
                <p>No courts for this facility yet.</p>
              ) : (
                getCourtsForFacility(facility.id).map((court) => (
                  <div key={court.id}>
                    <p>
                      <strong>{court.name}</strong> — {court.sport_type},{" "}
                      {court.indoor_outdoor}, {court.hourly_price} €/hour
                    </p>

                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => handleDeleteCourt(court.id)}
                    >
                      Delete Court
                    </button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCourtsPage;
