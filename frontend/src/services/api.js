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

export const getAdminReservations = async () => {
  const response = await fetch(`${API_BASE_URL}/reservations/admin`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const updateReservationStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  return response.json();
};

export const getFacilities = async () => {
  const response = await fetch(`${API_BASE_URL}/facilities`);
  return response.json();
};

export const createFacility = async (facilityData) => {
  const response = await fetch(`${API_BASE_URL}/facilities`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(facilityData),
  });

  return response.json();
};

export const updateFacility = async (id, facilityData) => {
  const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(facilityData),
  });

  return response.json();
};

export const deleteFacility = async (id) => {
  const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const createCourt = async (courtData) => {
  const response = await fetch(`${API_BASE_URL}/courts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(courtData),
  });

  return response.json();
};

export const updateCourt = async (id, courtData) => {
  const response = await fetch(`${API_BASE_URL}/courts/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(courtData),
  });

  return response.json();
};

export const deleteCourt = async (id) => {
  const response = await fetch(`${API_BASE_URL}/courts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const getEligibleReviewCourts = async () => {
  const response = await fetch(`${API_BASE_URL}/reviews/my-eligible-courts`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const createReview = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  });

  return response.json();
};

export const getCourtReviews = async (courtId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/court/${courtId}`);

  return response.json();
};
