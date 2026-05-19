import { useEffect, useState } from "react";
import {
  getFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getCourts,
  createCourt,
  updateCourt,
  deleteCourt,
} from "../services/api";

import styles from "./AdminCourtsPage.module.css";

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

const openingHoursRegex =
  /^([01]\d|2[0-3]):[0-5]\d - (([01]\d|2[0-3]):[0-5]\d|24:00)$/;

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isValidOpeningHours = (openingHours) => {
  if (!openingHoursRegex.test(openingHours)) {
    return false;
  }

  const [openingTime, closingTime] = openingHours.split(" - ");

  return timeToMinutes(openingTime) < timeToMinutes(closingTime);
};

function AdminCourtsPage() {
  const [facilities, setFacilities] = useState([]);
  const [courts, setCourts] = useState([]);

  const [newFacility, setNewFacility] = useState(emptyFacilityForm);
  const [newCourt, setNewCourt] = useState(emptyCourtForm);

  const [activeCourtFormFacilityId, setActiveCourtFormFacilityId] =
    useState(null);

  const [editingCourtId, setEditingCourtId] = useState(null);
  const [editingFacilityId, setEditingFacilityId] = useState(null);

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

    if (
      !newFacility.name ||
      !newFacility.address ||
      !newFacility.city ||
      !newFacility.opening_hours
    ) {
      alert("Facility name, address, city and opening hours are required");
      return;
    }

    if (!isValidOpeningHours(newFacility.opening_hours)) {
      alert(
        "Opening hours must be in format HH:MM - HH:MM, closing time can be 24:00, and opening time must be before closing time. Example: 07:00 - 23:00",
      );
      return;
    }

    let result;

    if (editingFacilityId) {
      result = await updateFacility(editingFacilityId, newFacility);

      if (result.message !== "Facility updated successfully") {
        alert(result.message || "Facility could not be updated");
        return;
      }

      alert("Facility updated successfully!");
    } else {
      result = await createFacility(newFacility);

      if (result.message !== "Facility created successfully") {
        alert(result.message || "Facility could not be created");
        return;
      }

      alert("Facility created successfully!");
    }

    setNewFacility(emptyFacilityForm);
    setEditingFacilityId(null);

    await loadData();
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

  const handleEditFacility = (facility) => {
    setEditingFacilityId(facility.id);

    setActiveCourtFormFacilityId(null);
    setEditingCourtId(null);
    setNewCourt(emptyCourtForm);

    setNewFacility({
      name: facility.name || "",
      address: facility.address || "",
      city: facility.city || "",
      contact_email: facility.contact_email || "",
      phone_number: facility.phone_number || "",
      opening_hours: facility.opening_hours || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateCourt = async (e, facilityId) => {
    e.preventDefault();

    const courtData = {
      ...newCourt,
      facility_id: facilityId,
    };

    let result;

    if (editingCourtId) {
      result = await updateCourt(editingCourtId, courtData);

      if (result.message !== "Court updated successfully") {
        alert(result.message || "Court could not be updated");
        return;
      }

      alert("Court updated successfully!");
    } else {
      result = await createCourt(courtData);

      if (result.message !== "Court created successfully") {
        alert(result.message || "Court could not be created");
        return;
      }

      alert("Court created successfully!");
    }

    setNewCourt(emptyCourtForm);

    setEditingCourtId(null);
    setActiveCourtFormFacilityId(null);

    await loadData();
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

  const handleEditCourt = (court) => {
    setEditingCourtId(court.id);
    setActiveCourtFormFacilityId(court.facility_id);

    setEditingFacilityId(null);
    setNewFacility(emptyFacilityForm);

    setNewCourt({
      name: court.name || "",
      description: court.description || "",
      sport_type: court.sport_type || "",
      indoor_outdoor: court.indoor_outdoor || "indoor",
      capacity: court.capacity || "",
      hourly_price: court.hourly_price || "",
    });
  };

  const handleCloseFacilityForm = () => {
    setEditingFacilityId(null);
    setNewFacility(emptyFacilityForm);
  };

  const handleOpenCourtForm = (facilityId) => {
    setEditingCourtId(null);
    setEditingFacilityId(null);
    setNewFacility(emptyFacilityForm);

    setActiveCourtFormFacilityId(facilityId);
    setNewCourt(emptyCourtForm);
  };

  const handleCloseCourtForm = () => {
    setActiveCourtFormFacilityId(null);
    setEditingCourtId(null);
    setNewCourt(emptyCourtForm);
  };

  const getCourtsForFacility = (facilityId) => {
    return courts.filter((court) => court.facility_id === facilityId);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Courts</h1>

      <form className={styles.formCard} onSubmit={handleCreateFacility}>
        <h2>{editingFacilityId ? "Edit Facility" : "Add Facility"}</h2>
        <div className={styles.formGrid}>
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
            placeholder="Opening Hours, e.g. 07:00 - 23:00"
            value={newFacility.opening_hours}
            onChange={handleFacilityChange}
            className={styles.input}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.button}>
            {editingFacilityId ? "Save Facility Changes" : "Add Facility"}
          </button>

          {editingFacilityId && (
            <button
              type="button"
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={handleCloseFacilityForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {facilities.length === 0 ? (
        <p className={styles.emptyMessage}>No facilities found.</p>
      ) : (
        <div>
          {facilities.map((facility) => (
            <div key={facility.id} className={styles.facilityCard}>
              <div className={styles.facilityHeader}>
                <div className={styles.facilityInfo}>
                  <h2>{facility.name}</h2>
                  <p>📍 {facility.address}</p>
                  <p>🏙 {facility.city}</p>
                  <p>✉️ {facility.contact_email}</p>
                  <p>📞 {facility.phone_number}</p>
                  <p>🕒 {facility.opening_hours}</p>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={() => handleEditFacility(facility)}
                  >
                    Edit Facility
                  </button>

                  <button
                    type="button"
                    className={`${styles.button} ${styles.deleteButton}`}
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
                </div>
              </div>

              {activeCourtFormFacilityId === facility.id && (
                <form onSubmit={(e) => handleCreateCourt(e, facility.id)}>
                  <h3>{editingCourtId ? "Edit Court" : "Add Court"}</h3>

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
                    {editingCourtId ? "Save Changes" : "Save Court"}
                  </button>

                  <button
                    type="button"
                    className={`${styles.button} ${styles.secondaryButton}`}
                    onClick={handleCloseCourtForm}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className={styles.courtsGrid}>
                {getCourtsForFacility(facility.id).length === 0 ? (
                  <p>No courts for this facility yet.</p>
                ) : (
                  getCourtsForFacility(facility.id).map((court) => (
                    <div key={court.id} className={styles.courtCard}>
                      <div className={styles.badge}>{court.sport_type}</div>

                      <h4>{court.name}</h4>

                      <p>
                        {court.indoor_outdoor} • {court.capacity} players
                      </p>

                      <p>
                        <strong>{court.hourly_price} €/hour</strong>
                      </p>

                      <p>{court.description}</p>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.button}
                          onClick={() => handleEditCourt(court)}
                        >
                          Edit Court
                        </button>

                        <button
                          type="button"
                          className={`${styles.button} ${styles.deleteButton}`}
                          onClick={() => handleDeleteCourt(court.id)}
                        >
                          Delete Court
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCourtsPage;
