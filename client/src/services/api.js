const BASE_URL = '/api';

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = localStorage.getItem('empoway_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    if (response.status === 500) {
      throw new Error('Unable to connect to the EMPOWAY backend server. Please start the backend server (run "start-empoway.bat" or "cd server; node server.js") and try again.');
    }
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('The EMPOWAY server is temporarily unavailable. Please try again shortly.');
    }
    if (response.status === 404) {
      throw new Error('The requested resource was not found on the server.');
    }
    throw new Error(`Request failed with status ${response.status}`);
  }
  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(fullName, email, password, bio) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ fullName, email, password, bio })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  async updatePreferences(preferences) {
    const res = await fetch(`${BASE_URL}/auth/preferences`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(preferences)
    });
    return handleResponse(res);
  },

  async updateMobilityProfile(mobilityProfile) {
    const res = await fetch(`${BASE_URL}/auth/mobility-profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ mobilityProfile })
    });
    return handleResponse(res);
  },

  // Places
  async getCategories() {
    const res = await fetch(`${BASE_URL}/places/categories`);
    return handleResponse(res);
  },

  // Directory: Parent Organizations
  async getOrganizations() {
    const res = await fetch(`${BASE_URL}/places/organizations`);
    return handleResponse(res);
  },

  // Directory: Colombo District Areas
  async getAreas() {
    const res = await fetch(`${BASE_URL}/places/areas`);
    return handleResponse(res);
  },

  // Limited sample place previews for public homepage (No auth required)
  async getSamplePreviewPlaces() {
    const res = await fetch(`${BASE_URL}/places/preview`);
    return handleResponse(res);
  },

  // Full place exploration & advanced filters (Protected endpoint, requires token)
  async getPlaces(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${BASE_URL}/places${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Complete place accessibility audit profile (Protected endpoint, requires token)
  async getPlaceById(id, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${BASE_URL}/places/${id}${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Personal Accessibility Match Dynamic Calculation
  async getPersonalMatch(id, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, typeof val === 'object' ? JSON.stringify(val) : val);
      }
    });
    const url = `${BASE_URL}/places/${id}/personal-match${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Accessible Transport Connection Checker
  async getTransportConnections(id) {
    const res = await fetch(`${BASE_URL}/places/${id}/transport-connections`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Side-by-side Place Comparison
  async comparePlaces(place1Id, place2Id) {
    const res = await fetch(`${BASE_URL}/places/compare?place1=${place1Id}&place2=${place2Id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async submitPlace(formData) {
    // formData can be FormData or plain object
    let headers;
    let body;

    if (formData instanceof FormData) {
      headers = getHeaders(true);
      body = formData;
    } else {
      headers = getHeaders(false);
      body = JSON.stringify(formData);
    }

    const res = await fetch(`${BASE_URL}/places`, {
      method: 'POST',
      headers,
      body
    });
    return handleResponse(res);
  },

  async uploadPlacePhotos(placeId, formData) {
    const res = await fetch(`${BASE_URL}/places/${placeId}/photos`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    return handleResponse(res);
  },

  // Reports
  async submitReport(reportData) {
    const res = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reportData)
    });
    return handleResponse(res);
  },

  async getPlaceReports(placeId) {
    const res = await fetch(`${BASE_URL}/reports/place/${placeId}`);
    return handleResponse(res);
  },

  // Public Stats
  async getPublicStats() {
    const res = await fetch(`${BASE_URL}/stats/public`);
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getPendingPlaces() {
    const res = await fetch(`${BASE_URL}/admin/pending-places`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async approvePlace(id, data = {}) {
    const res = await fetch(`${BASE_URL}/admin/places/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async rejectPlace(id, reason = '') {
    const res = await fetch(`${BASE_URL}/admin/places/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },

  async verifyPlace(id, data) {
    const res = await fetch(`${BASE_URL}/admin/places/${id}/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updatePlace(id, data) {
    const res = await fetch(`${BASE_URL}/admin/places/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deletePlace(id) {
    const res = await fetch(`${BASE_URL}/admin/places/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getAllReports(status = '') {
    const url = status ? `${BASE_URL}/admin/reports?status=${status}` : `${BASE_URL}/admin/reports`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async reviewReport(id, data) {
    const res = await fetch(`${BASE_URL}/admin/reports/${id}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async verifyPhotograph(photoId, isVerifiedEvidence = true) {
    const res = await fetch(`${BASE_URL}/admin/photographs/${photoId}/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ isVerifiedEvidence })
    });
    return handleResponse(res);
  },

  async getAdminLogs() {
    const res = await fetch(`${BASE_URL}/admin/logs`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Admin Directory & Organization Management
  async adminGetOrganizations() {
    const res = await fetch(`${BASE_URL}/admin/organizations`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async adminCreateOrganization(data) {
    const res = await fetch(`${BASE_URL}/admin/organizations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async adminUpdateOrganization(id, data) {
    const res = await fetch(`${BASE_URL}/admin/organizations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async adminDeleteOrganization(id) {
    const res = await fetch(`${BASE_URL}/admin/organizations/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async adminCreatePlace(data) {
    const res = await fetch(`${BASE_URL}/admin/places`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async adminImportCsv(data) {
    const res = await fetch(`${BASE_URL}/admin/places/csv-import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async adminPublishCsv(places) {
    const res = await fetch(`${BASE_URL}/admin/places/csv-publish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ places })
    });
    return handleResponse(res);
  },

  async adminGetDuplicates() {
    const res = await fetch(`${BASE_URL}/admin/places/duplicates`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // AI Accessibility Assistant Chat (Protected endpoint, requires token)
  async chatWithAssistant(message, history = []) {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message, history })
    });
    return handleResponse(res);
  },

  // Organization Portal
  async getMyOrgVenue() {
    const res = await fetch(`${BASE_URL}/organization/my-venue`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateOrgVenue(placeId, data) {
    const res = await fetch(`${BASE_URL}/organization/venues/${placeId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async respondToOrgReport(reportId, responseText, isResolved = false) {
    const res = await fetch(`${BASE_URL}/organization/reports/${reportId}/respond`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ responseText, isResolved })
    });
    return handleResponse(res);
  }
};

