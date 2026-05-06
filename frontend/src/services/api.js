const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getCourts = async () => {
  const response = await fetch(`${API_BASE_URL}/courts`);
  return response.json();
};

export const getReservations = async () => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const createReservation = async (reservationData) => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(reservationData),
  });

  return response.json();
};

export const deleteReservation = async (id) => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
};
