const API_BASE_URL = "http://localhost:5000";

export const getCourts = async () => {
  const response = await fetch(`${API_BASE_URL}/courts`);
  return response.json();
};

export const getReservations = async () => {
  const response = await fetch(`${API_BASE_URL}/reservations`);
  return response.json();
};

export const createReservation = async (reservationData) => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reservationData),
  });

  return response.json();
};

export const deleteReservation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
    method: "DELETE",
  });

  return response.json();
};
