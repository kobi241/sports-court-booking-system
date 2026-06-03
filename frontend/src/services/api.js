const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =======================
// Courts
// =======================

export const getCourts = async () => {
  const response = await fetch(`${API_BASE_URL}/courts`);
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

// =======================
// Facilities
// =======================

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

// =======================
// Reservations
// =======================

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

export const updateReservationStatus = async (id, statusData) => {
  const response = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(statusData),
  });

  return response.json();
};

// =======================
// Reviews
// =======================

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

export const updateReview = async (reviewId, reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  });

  return response.json();
};

export const deleteReview = async (reviewId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.json();
};

// =======================
// Profile
// =======================

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  return response.json();
};

export const getUserProfileById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

// =======================
// Notifications
// =======================

export const getNotifications = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getAuthHeaders(),
  });

  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  return response.json();
};

export const markAllNotificationsAsRead = async () => {
  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return response.json();
};
